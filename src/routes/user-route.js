const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login/', (req, res) => {
    res.render('user/login', {
        title: "Login",
    });
});

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/user/login' }), 
    (req, res) => {
        console.log("req.user: ", req.user)
        res.redirect('/user/me');
    }
)

router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
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