const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {creatPostController} = require('../controllers/post.controller');
const multer = require('multer');

const upload = multer({storage: multer.memoryStorage()});



router.post('/',
    authMiddleware,
    upload.single('image'),
    creatPostController
)

module.exports = router;