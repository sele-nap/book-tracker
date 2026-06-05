import { Router } from 'express';
import {
  deleteUserBook,
  getUserBook,
  getUserBooks,
  getUserBooksSearch,
  patchUserBook,
  postUserBook,
} from '../controllers/bookController.js';
import { validate } from '../utils/validate.js';
import {
  createBookSchema,
  updateBookSchema,
} from '../validators/bookValidator.js';

const router = Router();

router.get('/search', getUserBooksSearch);
router.get('/', getUserBooks);
router.get('/:id', getUserBook);
router.post('/', validate(createBookSchema), postUserBook);
router.patch('/:id', validate(updateBookSchema), patchUserBook);
router.delete('/:id', deleteUserBook);

export default router;
