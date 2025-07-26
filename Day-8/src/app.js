require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookeiParser = require('cookie-parser')

const app = express();
app.use(express.json())
app.use(cookeiParser())

app.use('/auth', authRoutes)

module.exports = app;