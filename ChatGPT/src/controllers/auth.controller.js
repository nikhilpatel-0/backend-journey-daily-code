const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
async function registerController(req, res){
    const {email, fullName: { firstName, lastName}, password } = req.body;

    const isUserExist = await userModel.findOne({email})

    if(isUserExist){
        return res.status(400).json({message: "user already exist"});
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        email,
        fullName: {
            firstName, lastName
        },
        password: hashPassword
    })

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.cookie('token', token)

    res.status(201).json({
        message: "user created successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}

async function loginController(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid email or password"})
    }

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET)
    res.cookie('token', token)

    res.status(200).json({
        message: "logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}

module.exports = {registerController, loginController};