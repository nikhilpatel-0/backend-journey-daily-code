const mongoose = require('mongoose');

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    }catch (err){
        console.err("mongoDB connction error", err)
    }
}

module.exports = connectDB;