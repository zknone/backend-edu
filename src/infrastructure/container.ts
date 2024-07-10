import { Container, decorate, injectable } from "inversify";
import { BooksService } from "../books/book.service";

export const myContainer =  new Container();
decorate(injectable(), BooksService);
myContainer.bind(BooksService).to(BooksService).inSingletonScope();


export {myContainer as container}