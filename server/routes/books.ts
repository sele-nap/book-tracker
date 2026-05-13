import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  searchBooks,
  updateBook,
} from '../controllers/bookController.js';

const router = Router();

router.get('/search', searchBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
