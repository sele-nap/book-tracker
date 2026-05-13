import { Router } from 'express';
import {
  createRead,
  deleteRead,
  getReadByBook,
  getReads,
  getReadsByStatus,
  updateRead,
} from '../controllers/readController.js';

const router = Router();

router.get('/', getReads);
router.get('/status/:status', getReadsByStatus);
router.get('/book/:bookId', getReadByBook);
router.post('/', createRead);
router.patch('/:id', updateRead);
router.delete('/:id', deleteRead);

export default router;
