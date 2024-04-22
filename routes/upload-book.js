const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');

router.post('/upload-book', 
    fileMulter.single('book'), 
    (req, res) => {
        if (req.file) {
            res.json(req.file);
        } else {
            res.status(400).json({ error: 'No file uploaded' });
        }
    }

    // if (req.file) {
    //     req.customFile = req.file;
    // }
    // next();
    //в таком случае я могу получить в индекс.js параметр и перезаписать его
);

module.exports = router;
