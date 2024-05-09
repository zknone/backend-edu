const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('user', {
        title: "Main page",
    });
});

router.get('/login', (req, res) => {
    res.render('user/login', {
        title: "Logging",
    });
});

module.exports = router;