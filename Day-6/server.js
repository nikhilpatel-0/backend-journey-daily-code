const express = require('express')
const connectToDB = require('./src/db/db')
const noteModel = require('./src/models/note.model')

const app = express()
connectToDB()

app.use(express.json())

app.post('/notes',async (req, res)=>{
    const {title, content} = req.body
    console.log(title, content)

    await noteModel.create({
        title, content
    })

    res.json({
        message: "Note created successfully..."
    })
})

app.get('/notes/:id',async (req, res)=>{
    const note = await noteModel.find()

    res.json({
        message: "Note fatched successfully...",
        note
    })
})

app.delete('/notes/:id',async (req, res)=>{
    const noteId = req.params.id

    await noteModel.findOneAndDelete({
        _id : noteId
    })

    res.json({
        message: "Note deleted successfully..."
    })
})

app.patch('/notes/:id', async (req, res)=>{
    const noteId = req.params.id
    const {title} = req.body

    await noteModel.findOneAndUpdate({
        _id : noteId
    },{
        title : title
    })

    res.json({
        message: "Note updated successfully..."
    })
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000...")
})