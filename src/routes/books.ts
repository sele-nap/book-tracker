import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from '../controllers/bookController.js';

const router = Router();

router.get('/search', searchBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
