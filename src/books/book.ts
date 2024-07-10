import { Document } from 'mongoose';

interface Book extends Document {
    title: string;
    description: string;
    authors: string[];
    favorite: boolean;
    fileCover: string;
    fileName: string;
}

export default Book