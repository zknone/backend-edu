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
const user = require('./models/user');

const app = express();

const options = {
    usernameField: 'username',
    passwordField: 'password',
};

passport.serializeUser((user, cb) => {
  cb(null, user.id)
});

passport.deserializeUser( (id, cb) => {
  db.users.findUserById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
});
/// переписать

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
        const users = await UserModel.find().select('-__v');

        console.log(users);

        const verify = ( username, password, done) => {
            users.map(user => {
                if (users.length === 0) {
                    console.log('User null');
                    return done(null, user);
                };
                
                if (user.username != username) {
                    console.log('Undefined user');
                    return done(null, user);
                } 
                
                if (user.password !== password ) {
                    return done (null, false);
                }
                return (null, user);
            })
        }

        passport.use('local', new LocalStrategy(options, verify));

        app.listen(PORT, () => {
            console.log(`=== start server PORT ${PORT} ===`);
        })
    } catch (e){
        console.log(e);
    }
}

start(PORT, UrlDB);