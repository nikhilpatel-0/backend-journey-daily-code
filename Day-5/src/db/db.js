const { default: mongoose } = require('mongoose')
const mangoose = require('mongoose')

function connectToDB(){
    mongoose.connect("mongodb+srv://govindapatel254:z01wFQQBEUtkUJWa@cluster0.viyr1xz.mongodb.net/cohort")
    .then(()=>{
        console.log("connected to DB...")
    })
}

module.exports = connectToDB