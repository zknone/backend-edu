const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const db = require('./db');

const indexRouter = require('./routes/index-route');
const booksRouter = require('./routes/books-route');
const userRouter = require('./routes/user-route');

const app = express();

const verify = (username, password, done) => {
    db.users.findByUsername(username, (err, user) => {
        if (err) {return done(err)}
        if (!user) { return done(null, false) }
  
        if( !db.users.verifyPassword(user, password)) {
            return done(null, false)
        }
        return done(null, user)
    })
  }


const options = {
    usernameField: 'username',
    passwordField: 'password',
};

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
  db.users.findUserById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

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