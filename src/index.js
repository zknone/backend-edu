const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const UserModel = require('./models/user');
const socketIO = require('socket.io');
const http = require('http');


const indexRouter = require('./routes/index-route');
const booksRouter = require('./routes/books-route');
const userRouter = require('./routes/user-route');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const options = {
    usernameField: 'username',
    passwordField: 'password',
};

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
const UrlDB = process.env.URL_DB;

async function start(PORT) {
    try {
        const verify = async (username, password, done) => {
            const user = await UserModel.findOne({ username: username }).select('-__v');
            console.log('user', user);

            if (!user) {
                return done(null, false);
            }

            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        };

        passport.serializeUser((user, cb) => {
            cb(null, user.id);
        });

        passport.deserializeUser(async (id, cb) => {
            const user = await UserModel.findById(id).select('-__v');
            if (!user) {
                return cb(new Error('User not found'));
            }
            cb(null, user);
        });

        passport.use(new LocalStrategy(options, verify));

        server.listen(PORT, () => { 
            console.log(`=== start server PORT ${PORT} ===`);
        });
    } catch (e) {
        console.log(e);
    }
}

start(PORT, UrlDB);

io.on('connection', (socket) => {
    const {id} = socket;
    console.log('connection', id);

    socket.on('message-to-me', (msg) => {
        msg.type = 'me';
        socket.emit('message-to-me', msg);
    });

    socket.on('message-to-all', (msg) => {
        msg.type = 'all';
        socket.broadcast.emit('message-to-all', msg);
        socket.emit('message-to-all', msg);
    });

    const {roomId} = socket.handshake.query;
    console.log('roomId', roomId);
    socket.join(roomId);
    socket.on('message-to-room', (msg) => {
        msg.type = `roomId: ${roomId}`;
        socket.to(roomId).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    })

    socket.on('disconect', ()=> {
        console.log('we are disconnected with', id)
    })
});
