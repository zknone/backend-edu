const bookUploader = require('./upload-book');
const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

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
        new Book(
            "Новая жизнь", 
            "Книга о новой жизни",
            uuid(),
            "Андрей Булгаков",

            ),
        new Book(
            "Старая жизнь", 
            "Книга о старой жизни",
            uuid(),
            "Андрей Булгаков",
        ),
        new Book(
            "Вторая жизнь", 
            "Книга о второй жизни",
            uuid(),
            "Андрей Булгаков",
        ),
        new Book(
            "Загробная жизнь", 
            "Книга о загробной жизни",
            uuid(),
            "Андрей Булгаков",
        ),
    ],
};

router.get('/', (req, res) => {
    const {books} = store;
    res.render('books/', {
        title: "Books",
        books: books,
    });
})

router.get('/download/:id', (req, res) => {
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

router.use('/upload/:id', bookUploader, (req, res) => {
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

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "New book",
        book: {
            title: '',
            desc: '',
            authors: '',
        },
    });
});

router.post('/create', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;

    const newBook = new Book(
        title, 
        desc, 
        uuid(), 
        authors,
        favorite, 
        fileCover, 
        fileName
    );
    
    books.push(newBook);

    res.status(201);
    res.redirect('/books');
});

router.get('/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render("books/view", {
        title: 'Book',
        book: books[idx],
    });
});

router.get('/update/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("books/update", {
        title: "Books | view",
        book:{
            title: books[idx].title ?? '',
            desc: books[idx].desc ?? ''
        }
        
        ,
    });
});

router.post('/update/:id', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx == -1){
        res.redirect('/404');
    };
    books[idx] = {
            ...books[idx],
            title,
            desc,
            authors, 
            favorite, 
            fileCover, 
            fileName
    };
    res.redirect(`/books`);
})

router.post('/delete/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id)
     
    if(idx == -1){

        res.redirect('/404');
    }

    books.splice(idx, 1);
    res.redirect(`/books`);
})

module.exports = router;