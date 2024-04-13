const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');

router.post('/upload-book', 
    fileMulter.single('book'), 
    (req, res, next) => {
        if (req.file) {
            const { path } = req.file;
            req.bookFilePath = path;
        }
        next();
    }
)

module.exports = router;