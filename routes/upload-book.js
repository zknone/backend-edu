const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');

router.post('/:id', fileMulter.single('book'), (req, res) => {
    const { id } = req.params;
    const store = req.app.get('store');

    const idx = store.books.findIndex(el => el.id === id);

    if (idx !== -1){
        if (req.file) {
            const { filename } = req.file;
            store.books[idx].fileBook = filename; 
        }
        res.json(store.books[idx]);
    } else {
        res.status(404).json('404 | страница не найдена');
    }
});

module.exports = router;
