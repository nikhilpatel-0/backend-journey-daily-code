const express = require('express')
const connectToDB = require('./src/db/db')

connectToDB()
const app = express()
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Hello world...")
})

app.post('/notes', (req, res)=>{
    const {title, contant} = req.body
    console.log(title,contant)
})

app.listen(3000, ()=>{
    console.log("server running on port 3000....")
})