const uploadBookRouter = require('./upload-book');
const express = require('express');
const router = express.Router();
const http = require('http');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const BookItem = require('../models/book');

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
    try {
        const books = await BookItem.find().select('-__v');
        res.render('books', {
            title: "Books",
            books: books,
        });

    } catch (e) {
        res.status(500).json(e);
    }
})

router.get('/download/:id', (req, res) => {
    // res.download(path, book.fileName);
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

router.post('/create', async (req, res) => {
    const { title, description, authors } = req.body;
    const newBook = new BookItem({
        title,
        description,
        authors
    });

    try {
        await newBook.save();
        res.redirect(`/books`);
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/404');
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const book = await BookItem.findById(id);

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
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const book = await BookItem.findById(id);

        if (!book) {
            res.redirect('/404');
        }
        res.render("books/update", {
            title: "Books | view",
            book:{
                title: book.title ?? '',
                desc: book.description ?? ''
            }
        });
    
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/404');
    }
});

router.post('/update/:id', async (req, res) => {
    const {title, description, authors } = req.body;
    const {id} = req.params;

    try {
        await BookItem.findByIdAndUpdate(id, {
            title,
            description,
            authors
        });
        res.redirect(`/books`);
    
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

router.post('/delete/:id', async(req, res) => {
    const {id} = req.params;

    try {
        const book = await BookItem.findById(id);

        await BookItem.deleteOne(book);
        res.redirect(`/books`);
    
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

module.exports = router;