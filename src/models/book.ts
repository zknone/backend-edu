import { Schema, model, Document, Model } from 'mongoose';

export class IBook {
    title: string;
    description: string;
    authors: string;
    favorite: string;
    fileCover: string;
    fileName: string;

    constructor(
        title: string, 
        description: string, 
        authors: string, 
        favorite: string, 
        fileCover: string, 
        fileName: string) {
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

interface Book extends IBook, Document {
    title: string;
    description: string;
    authors: string;
    favorite: string;
    fileCover: string;
    fileName: string;
}

const bookSchema = new Schema<Book>({
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
});


export default model<Book>('Book', bookSchema) as Model<Book>;