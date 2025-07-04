const express = require('express')

const app = express() //server create ho gya 

let notes = []

app.use(express.json())

app.post('/notes', (req, res)=>{
    console.log(req.body)
    notes.push(req.body)
    res.json({
        message: "Note added",
    })
})

app.get('/notes', (req, res)=>{
    res.json(notes)
})

app.delete('/notes/:index', (req,res)=>{
    const index = req.params.index
    delete notes[index]
    res.json({
        message: "Notes Deleted successfully..."
    })
})

app.patch('/notes/:index', (req, res)=>{
    const index = req.params.index
    const {title} = req.body
    notes[index].title = title

    res.json({
        message: "notes updated successfully..."
    })
})

app.listen(3000, ()=>{
    console.log("server running on port 3000...")
})