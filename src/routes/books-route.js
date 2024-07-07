const uploadBookRouter = require('./upload-book');
const express = require('express');
const router = express.Router();
const http = require('http');
const BookModel = require('../models/book');

const myContainer = require('../container');

function getCounter(path, callback) {
    const options = {
        hostname: 'counter',
        port: process.env.COUNTER_PORT || 3000, 
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, JSON.parse(data));
        });
    });
    req.on('error', (error) => {
        callback(error, null);
    });
    req.end();
}

function incrCounter (path, callback) {
    const options = {
        hostname: 'counter',
        port: process.env.COUNTER_PORT || 3000, 
        path: path,
        method: 'POST'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, JSON.parse(data));
        });
    });
    req.on('error', (error) => {
        callback(error, null);
    });
    req.end();
}

router.get('/', async (req, res) => {
    const repo = myContainer.get(bookRepository);

    try {
        const books = await repo.getAll();
        res.json(books);
        // const books = await BookModel.find().select('-__v');
        // res.render('books', {
        //     title: "Books",
        //     books: books,
        // });

    } catch (e) {
        res.status(500).json(e);
    }
})

router.get('/download/:id', (req, res) => {
    // res.download(path, book.fileName);
});

router.use('/upload-book', uploadBookRouter);

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

router.post('/create', async (req, res) => {
    const repo = myContainer.get(bookRepository);
    const { title, description, authors } = req.body;

    try {
        const book = repo.create(title, description, authors);
        res.json(book);
        res.redirect(`/books`);
    } catch {
        console.error('Error:', error);
        res.redirect('/404');
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    const repo = myContainer.get(bookRepository);


    try {
        const book = repo.getById(id);
        if (!book) {
            res.redirect('/404');
        }

        incrCounter(`/counter/${id}/incr`, (error) => {
                    if (error) {
                        console.error('Error getting counter:', error);
                        res.redirect('/404');
                    } else {
                        getCounter(`/counter/${id}`, (error, data) => {
                            if (error) {
                                console.error('Error getting counter:', error);
                                res.redirect('/404');
                            } else {
                                const counter = data?.cnt ?? 0;
                                res.render("books/view", {
                                    title: 'Book',
                                    book: book,
                                    counter: counter
                                });
                            }
                        });
                    }
                })
        res.json(book);
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    try {    const repo = myContainer.get(bookRepository);
    const book = repo.getById(id);
    if (!book) {
            res.redirect('/404');
        }
    res.json(book);
    } catch (error) {
            console.error('Error:', error);
            res.redirect('/404');
    }
});

router.post('/update/:id', async (req, res) => {
    const {title, description, authors } = req.body;
    const {id} = req.params;
    const repo = myContainer.get(bookRepository);

    try {
        const book = repo.update(id, title, description, authors);
        res.json(book);
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

router.post('/delete/:id', async(req, res) => {
    const {id} = req.params;
    const repo = myContainer.get(bookRepository);
    try {
        repo.delete(id);
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

module.exports = router;