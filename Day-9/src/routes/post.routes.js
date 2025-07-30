const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

const router = express.Router();

router.post('/',
    authMiddleware,
    upload.single('image'),
    creatPostController
)

module.exports = router;