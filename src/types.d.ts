import { Request } from 'express';
import { File } from 'multer';

declare module 'express-serve-static-core' {
    interface Request {
        file?: File;
        user?: any;
    }
}