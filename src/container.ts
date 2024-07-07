import { Container } from "inversify";
import { TYPES } from "./classes/types";

const myContainer =  new Container();
myContainer.bind(TYPES.BookRepository).toSelf();


export {myContainer as container}