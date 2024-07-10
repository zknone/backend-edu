import mongoose, { Model, Schema } from 'mongoose';
import Book from './book';

const bookSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    authors: { type: [String], required: true },
    favorite: { type: Boolean, required: true },
    fileCover: { type: String, required: true },
    fileName: { type: String, required: true }
});

const BookModel: Model<Book> = mongoose.model<Book>('Book', bookSchema);

export default BookModel;