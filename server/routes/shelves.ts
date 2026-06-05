import { Router } from 'express';
import {
  deleteUserShelf,
  deleteUserShelfBook,
  getUserShelves,
  patchUserShelfBook,
  postUserShelf,
} from '../controllers/shelfController.js';
import { validate } from '../utils/validate.js';
import { createShelfSchema } from '../validators/shelfValidator.js';

const router = Router();

router.get('/', getUserShelves);
router.post('/', validate(createShelfSchema), postUserShelf);
router.patch('/:id/books/:bookId', patchUserShelfBook);
router.delete('/:id/books/:bookId', deleteUserShelfBook);
router.delete('/:id', deleteUserShelf);

export default router;
