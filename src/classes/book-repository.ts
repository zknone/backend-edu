import { IBook } from "../models/book";

export abstract class BookRepository{
    abstract createBook(Book: IBook): Promise<IBook>;
    abstract getBook(id: string): Promise<IBook>;
    abstract getBooks(): Promise<IBook[]>;
    abstract updatedBook(id: string): Promise<IBook>;
    abstract deleteBook(id: string): Promise<IBook>;
}