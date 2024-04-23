const uploadBookRouter = require('./upload-book');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const store = req.app.get('store');
    const {books} = store;
    res.render('books/', {
        title: "Books",
        books: books,
    });
})

router.get('/download/:id', (req, res) => {
    const store = req.app.get('store');
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

router.use('/api/books/upload-book', uploadBookRouter);

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
    const store = req.app.get('store');
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
    const store = req.app.get('store');
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
    const store = req.app.get('store');
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
    const store = req.app.get('store');
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
    const store = req.app.get('store');
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