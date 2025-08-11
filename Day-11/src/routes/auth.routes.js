const express = require('express');
const { getRegisterController } = require('../controller/auth.controller')

const router = express.Router();

router.get('/register', getRegisterController)

module.exports = router;