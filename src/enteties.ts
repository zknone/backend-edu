import "reflect-metadata";
import { BookRepository } from "./classes/book-repository";
import { TYPES } from "./classes/types";
import { injectable, inject } from "inversify";
import { IBook } from "./models/book";

@injectable()
class BookService implements BookRepository{
    public createBook(Book: IBook): Promise<IBook>{
        throw new Error("Method not implemented.");
    }
    public getBook(id: string): Promise<IBook>{
        throw new Error("Method not implemented.");
    }
    public getBooks(): Promise<IBook[]>{
        throw new Error("Method not implemented.");
    }
    public updatedBook(id: string): Promise<IBook>{
        throw new Error("Method not implemented.");
    }
    public deleteBook(id: string): Promise<IBook>{
        throw new Error("Method not implemented.");
    }
}

export { BookService}