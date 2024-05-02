const express = require('express');
const redis = require('redis');
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/counter/:bookId", (req, res) => {
    const {bookId} = req.bookId;

    res.json({bookId: bookId});
})

app.post("/counter/:bookId/incr", (req, res) => {
})

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
});