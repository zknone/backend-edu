import express, { Request, Response} from 'express';
const router = express.Router();
import fileUploader from '../middleware/file';

router.post('/:id', fileUploader.single('book'), (req: Request, res: Response) => {
    const { id } = req.params;
    const store = req.app.get('store');

    const idx = store.books.findIndex((el: { id: string; }) => el.id === id);

    if (idx !== -1){
        if (req.file) {
            const { filename } = req.file;
            store.books[idx].fileBook = filename; 
        }
        res.json(store.books[idx]);
    } else {
        res.status(404).json('404 | страница не найдена');
    }
});

export default router;
