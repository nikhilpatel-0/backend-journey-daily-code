const express = require('express')

const app = express()

let notes = []

app.use(express.json())

app.post('/notes', (req, res)=>{
    console.log(req.body)
    notes.push(req.body)
    res.json({
        message: "Note added successfully...",
        notes: notes
    })
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000...")
})