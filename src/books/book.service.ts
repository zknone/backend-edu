import Book from "./book";
import BookModel from "./book.model";

interface CreateBookDTO {
    title: Book['title'];
    description: Book['description'];
    authors: Book['authors'];
    favorite: Book['favorite'];
    fileCover: Book['fileCover'];
    fileName: Book['fileName'];
}

export class BooksService {
    constructor() {
        console.log('new BooksService');
    }

    async create(data: CreateBookDTO): Promise<Book> {
        const book = new BookModel(data);
        await book.save();
        return book.toObject() as Book;
    }

    findAll(): Promise<Book[]> {
        return BookModel.find().exec().then(books => books.map(book => book.toObject() as Book));
    }
    getById(id: string): Promise<Book | null> {
        return  BookModel.findById(id).exec().then(book => book?.toObject() as Book | null);
    }

    async update(id: string, {title, description, authors}: {title: string, description: string, authors: string[]}): Promise<Book | null> {
        return BookModel.findByIdAndUpdate(id, {title, description, authors}, {new: true}).exec().then(book => book?.toObject() as Book | null);
    }

    async delete(id: string): Promise<{deletedCount?: number}> {
        const result = await BookModel.deleteOne({_id: id}).exec();
        return { deletedCount: result.deletedCount };
    }
}