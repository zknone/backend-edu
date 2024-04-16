const bookUploader = require('./routes/upload-book');
const express = require('express');
const router = express.Router();

class Book {
    constructor(
        title = "", 
        desc = "", 
        id = uuid(),
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        fileBook = ""
        ) {
        this.title = title;
        this.desc = desc;
        this.id = id;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const store = {
    books: [
        new Book(),
        new Book(),
        new Book(),
        new Book(),
    ],
};

router.get('/books', (req, res) => {
    const {books} = store;
    res.json(books);

    app.render();
})

router.get('/books/:id/download', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        const path = books[idx].fileBook;

        if (path) {
            res.download(path, books[idx].fileName);
        } else {
            res.status(404).json('Файл не найден');
        }
    } else {
        res.status(404).json('Книга не найдена');
    }
});

router.get('/books/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if( idx !== -1) {
        res.json(books[idx]);
    } else {
        res.status(404)
        res.json('404 | страница не найдена');
    }
});

router.use('/books/:id/', bookUploader, (req, res) => {
    const {id} = req.params;
    const {books} = store;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1){
        const { bookFilePath } = req;

        if (bookFilePath) {
            books[idx].fileBook = bookFilePath; 
        }
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json('404 | страница не найдена');
    }

});

router.post('/books/', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;

    const newBook = new Book(title, desc, authors, favorite, fileCover, fileName);
    books.push(newBook);

    res.status(201);
    res.json(newBook);
})

router.put('/books/:id', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title,
            desc,
            authors, 
            favorite, 
            fileCover, 
            fileName
        };
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json('404 | страница не найдена');
    }
})

router.delete('/books/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
        books.splice(idx, 1)
        res.json('Ok');
    } else {
        res.status(404)
        res.json('404 | страница не найдена');
    }
})