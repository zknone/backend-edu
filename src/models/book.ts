const {Schema, model} = require('mongoose');

class Book {
    title: string;
    description: string;
    authors: string
    favorite: string;
    fileCover: string;
    fileName: string;
};

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
        required: false,
    },
    favorite: {
        type: String,
        required: false,
    },
    fileCover: {
        type: String,
        required: false,
    },
    fileName: {
        type: String,
        required: false,
    },
}).add(Book);


module.exports = model('Book', bookSchema);