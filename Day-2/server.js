const express = require('express');

const app = express();

app.get('/home',(req, res)=>{
    res.send("welcome to home page...")
})

app.get('/about', (req,res)=>{
    res.send("welcome to about page...")
})

app.get('/contact', (req,res)=>{
    res.send("welcome to contact page...")
})


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
