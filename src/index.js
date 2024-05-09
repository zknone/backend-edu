const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index-route');
const booksRouter = require('./routes/books-route');
const userRouter = require('./routes/user-route');

const app = express();

app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
const UrlDB = process.env.URL_DB;

async function start(PORT, urlDb) {
    try{
        await mongoose.connect(urlDb, { dbName: 'books' });
        app.listen(PORT, () => {
            console.log(`=== start server PORT ${PORT} ===`);
        })
    } catch (e){
        console.log(e);
    }
}

start(PORT, UrlDB);