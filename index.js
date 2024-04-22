const { v4: uuid } = require('uuid');
const express = require('express');
const fileMulter = require('./middleware/file');

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

const app = express();
app.use(express.json());
app.use('/public/', express.static(__dirname+'/public/'));

app.post('/api/user/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
})

app.get('/api/books', (req, res) => {
    const {books} = store;
    res.json(books);
})

app.get('/api/books/:id/download', (req, res) => {
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

app.get('/api/books/:id', (req, res) => {
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

app.use('/api/books/:id/', fileMulter.single('book'));

app.post('/api/books/:id/upload-book', (req, res) => {
    const { id } = req.params;
    const { books } = store;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1){
        if (req.file) {
            const { filename } = req.file;
            books[idx].fileBook = filename; 
        }
        res.json(books[idx]);
    } else {
        res.status(404).json('404 | страница не найдена');
    }
});

app.post('/api/books/', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;

    const newBook = new Book(title, desc, authors, favorite, fileCover, fileName);
    books.push(newBook);

    res.status(201);
    res.json(newBook);
})

app.put('/api/books/:id', (req, res) => {
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

app.delete('/api/books/:id', (req, res) => {
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

const PORT = process.env.PORT || 3000
app.listen(PORT)