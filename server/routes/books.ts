import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  searchBooks,
  updateBook,
} from '../controllers/bookController.js';
import { validate } from '../utils/validate.js';
import {
  createBookSchema,
  updateBookSchema,
} from '../validators/bookValidator.js';

const router = Router();

router.get('/search', searchBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', validate(createBookSchema), createBook);
router.patch('/:id', validate(updateBookSchema), updateBook);
router.delete('/:id', deleteBook);

export default router;
