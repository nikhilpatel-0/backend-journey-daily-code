const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.services')
const messageModel = require('../models/message.model')
const {createMemory, queryMemory} = require('../services/vector.services')
function initSocketServer(httpServer){
    const io = new Server(httpServer, {})

    io.use(async (socket, next)=>{

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")
        
        if(!cookies.token){
            next(new Error("Authentication error : No token provided"))
        }

        try{
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)

            const user = await userModel.findById(decoded.id)

            socket.user = user

            next()

        }catch (err){
    
            next(new Error("Authentication error : No token provided"))
        }
    })

    io.on('connection', (socket)=>{
        
        socket.on('ai-message', async (messagePayloade)=>{

            const [message, vectors] = await Promise.all([
                messageModel.create({
                    chat: messagePayloade.chat,
                    user: socket.user._id,
                    content: messagePayloade.content,
                    role: "user"
                }),
                aiService.generateVector(messagePayloade.content)
            ])

            const [memory, chatHistory] = await Promise.all([
                    queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {}
                }),
                messageModel.find({chat: messagePayloade.chat})
                    .sort({createdAt: -1})
                    .limit(20)
                    .lean()
                    .then(message => message.reverse())
            ])

            createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayloade.chat,
                    user: socket.user._id,
                    text: messagePayloade.content
                } 
            })

            const stm = chatHistory.map(item=>{
                return {
                    role: item.role,
                    parts: [{text: item.content}]
                }
            })

            const ltm = [
                {
                    role: 'user',
                    parts: [{
                        text: `these are some previous message from the chat, use them to generate a response
                        
                        ${memory.map(item=> item.metadata.text).join("\n")}`
                    }]
                }
            ]

            console.log(ltm[0])
            console.log(stm)
            
            const response = await aiService.generateResponse([...ltm, ...stm])

            const [responseMessage, responseVectors] = await Promise.all([
                 messageModel.create({
                chat: messagePayloade.chat,
                user: socket.user._id,
                content: response,
                role: "model"
                }),
                aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayloade.chat,
                    user: socket.user._id,
                    text: response
                }
            })

            socket.emit('ai-response',{
                content: response,
                chat: messagePayloade.chat
            })
        })
    })
}

module.exports = initSocketServer