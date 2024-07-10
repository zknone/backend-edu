import uploadBookRouter from './upload-book';
import express, {Request, Response} from 'express';
const router = express.Router();
import http, {RequestOptions, IncomingMessage} from 'http';
import { BooksService} from '../books/book.service'

const myContainer = require('../container');

function getCounter(path: string, callback: { (error: any, data: any): void; (arg0: null, arg1: null): void; }) {
    const options = {
        hostname: 'counter',
        port: process.env.COUNTER_PORT || 3000, 
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res: IncomingMessage) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, JSON.parse(data));
        });
    });
    req.on('error', (error: Error) => {
        callback(error, null);
    });
    req.end();
}

function incrCounter(path: string, callback: (error: Error | null, data: any | null) => void) {
    const options: RequestOptions = {
        hostname: 'counter',
        port: process.env.COUNTER_PORT || 3000, 
        path: path,
        method: 'POST'
    };

    const req = http.request(options, (res: IncomingMessage) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, JSON.parse(data));
        });
    });

    req.on('error', (error: Error) => {
        callback(error, null);
    });

    req.end();
}

router.get('/', async (req: Request, res: Response) => {
    const service: BooksService = myContainer.get("BOOKS_SERVICE");
    const books = await service.findAll();
    res.json(books);
})

router.get('/download/:id', (req: Request, res: Response) => {
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
    const service: BooksService = myContainer.get("BOOKS_SERVICE");
    const book = await service.create(req.body);
    res.json(book);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;    
    const service: BooksService = myContainer.get("BOOKS_SERVICE");

    try {
        const book = service.getById(id);
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
    try {    
        const service: BooksService = myContainer.get("BOOKS_SERVICE");
        const book = service.getById(id);
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
    const service: BooksService = myContainer.get("BOOKS_SERVICE");

    try {
        const book = service.update(id, {title, description, authors});
        res.json(book);
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

router.post('/delete/:id', async(req, res) => {
    const {id} = req.params;
    const service = myContainer.get("BOOKS_SERVICE");
    try {
        service.delete(id);
    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/books/${id}`);
    }
});

export default router;