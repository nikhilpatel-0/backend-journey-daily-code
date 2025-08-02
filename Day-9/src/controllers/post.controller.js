const postModel = require('../models/post.model');
const generateCaption = require('../service/ai.service');

async function creatPostController(req, res) {
    const file = req.file;

    console.log("File received:", file);

    const base64ImageFile = Buffer.from(file.buffer).toString('base64');
    
    const caption = await generateCaption(base64ImageFile);
    console.log("genereted caption:", caption);
}

module.exports = {
    creatPostController,
}