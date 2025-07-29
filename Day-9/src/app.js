require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', userRoutes);

module.exports = app;