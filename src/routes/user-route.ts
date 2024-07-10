import express, {Request, Response} from 'express';
import passport from 'passport';
const router = express.Router();
const UserModel = require('../models/user');

router.get('/login/', (req, res) => {
    res.render('user/login', {
        title: "Login",
    });
});

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/user/login' }), 
    (req, res) => {
        res.redirect('/user/me');
    }
)

router.get('/signup/', (req: Request, res: Response) => {
    res.render('user/signup', {
        title: "Login",
    });
});

router.post('/signup',
    async (req: Request, res: Response, next) => {
        const { username, password } = req.body;
        const newUser = new UserModel({
            username,
            password,
        });

        try {
            await newUser.save();
            req.login(newUser, err => {
                if (err) {
                    return next(err);
                }
                res.redirect('/user/me');
            });
        } catch (error) {
            console.error('Error:', error);
            res.redirect('/404');
        }
    }
);


router.get('/logout', (req: Request, res: Response) => {
    req.logout(req.user, err => {
        if(err) return err;
            res.redirect('/');
    })
})

router.get('/me', (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/user/login');
        };
        next();
    }, (req, res) => {
        res.render('user/profile', {
            title: 'Profile',
            user: req.user,
        })
    }
)

module.exports = router;