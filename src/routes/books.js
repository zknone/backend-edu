const uploadBookRouter = require('./upload-book');
const express = require('express');
const router = express.Router();
const http = require('http');

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

router.get('/', (req, res) => {
    const store = req.app.get('store');
    const {books} = store;
    res.render('books', {
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
                        book: books[idx],
                        counter: counter
                    });
                }
            });
        }
    })
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