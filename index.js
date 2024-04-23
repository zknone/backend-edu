let ejs = require('ejs');
const express = require('express');
const indexRouter = require('./routes/index-route');
const booksRouter = require('./routes/books');

const app = express();

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

app.set('store', store);
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.json());
app.use('public/', express.static(__dirname+'/public/'));


app.use('/', indexRouter);
app.use('/books', booksRouter);

app.post('/user/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`=== start server PORT ${PORT} ===`);
});