import multer from 'multer';
import { Request } from 'express';
const storage = multer.diskStorage({
    destination(req: Request, file, callback) {
        callback(null, 'public/books');
    },
    filename(req: Request, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileUploader = multer({storage});

export default fileUploader;