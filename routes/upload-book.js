const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');

router.post('/upload-book', 
    fileMulter.single('book'), 
    (req, res, next) => {
        if (req.file) {
            const { path } = req.file;
            req.bookFilePath = path; // Сохраняем path в req для передачи в основной обработчик Express
        }
        next();
    }
)

module.exports = router;