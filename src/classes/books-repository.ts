import { IBook } from "../models/book";

export class BooksRepository{

    constructor() {}

    createBooks(Book: IBook): void {}
    getBook(id: string): void {}
    getBooks(): void {}
    updatedBook(id): void{}
    deleteBook(id): void{}
}