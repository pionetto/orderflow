import { Router } from 'express';
import { uploadController } from './controllers/uploadController';
import { ordersController } from './controllers/ordersController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', upload.single('file'), uploadController);
router.get('/orders', ordersController);

export { router };
