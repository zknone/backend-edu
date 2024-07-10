import Book from "./books/book";

export abstract class BooksRepository{

    constructor() {}

    abstract createBook(Book: Book): Promise<Book>;
    abstract getBook(id: string): Promise<Book>;
    abstract getBooks(): Promise<Book[]>;
    abstract updatedBook(id: string): Promise<Book>;
    abstract deleteBook(id: string): Promise<Book>;
}