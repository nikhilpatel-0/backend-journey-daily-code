const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.services')
const messageModel = require('../models/message.model')
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

            await messageModel.create({
                chat: messagePayloade.chat,
                user: socket.user._id,
                content: messagePayloade.content,
                role: "user"

            })

            const chatHistory = (await messageModel.find({
                chat: messagePayloade.chat
            }).sort({createdAt: -1}).limit(4).lean()).reverse()

            const response = await aiService.generateResponse(chatHistory.map(item=>{
                return {
                    role: item.role,
                    parts: [{text: item.content}]
                }
            }))

            await messageModel.create({
                chat: messagePayloade.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            socket.emit('ai-response',{
                content: response,
                chat: messagePayloade.chat
            })
        })
    })
}

module.exports = initSocketServer