const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const UserModel = require('./models/user');

const indexRouter = require('./routes/index-route');
const booksRouter = require('./routes/books-route');
const userRouter = require('./routes/user-route');

const app = express();

const options = {
    usernameField: 'username',
    passwordField: 'password',
};

app.use(express.urlencoded());
app.use(session({ secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());

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
    try {
        await mongoose.connect(urlDb, { dbName: 'books' });    
        const verify = async (username, password, done) => {
            const user = await UserModel.find({ username: username }).select('-__v');
            console.log('user', user[0]);

            if (!user[0]) { return done(null, false) };

            if (user[0].password !== password) {
                return done(null, false);
            }
            return done(null, user[0]);
        }

        passport.serializeUser((user, cb) => {
            cb(null, user.id)
        });

        passport.deserializeUser( async (id, cb) => {
            const users = await UserModel.find().select('-__v');
            const user = users.find(user => user.id === id);
            if (!user) {
                return cb(new Error('User not found'));
            }
            cb(null, user);
        });

        passport.use('local', new LocalStrategy(options, verify));

        app.listen(PORT, () => {
            console.log(`=== start server PORT ${PORT} ===`);
        })
    } catch (e) {
        console.log(e);
    }
}

start(PORT, UrlDB);