let ejs = require('ejs');
const express = require('express');
const indexRouter = require('./routes/index-route');
const path = require('path');
const booksRouter = require('./routes/books');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use('public/', express.static(__dirname+'/public/'));

app.use('/books', booksRouter);
app.use('/', indexRouter);

app.post('/user/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=== start server PORT ${PORT} ===`);
    console.log('Started!')
});