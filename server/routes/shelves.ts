import { Router } from 'express';
import {
  addBookToShelf,
  createShelf,
  deleteShelf,
  getShelves,
  removeBookFromShelf,
} from '../controllers/shelfController.js';

const router = Router();

router.get('/', getShelves);
router.post('/', createShelf);
router.patch('/:id/books/:bookId', addBookToShelf);
router.delete('/:id/books/:bookId', removeBookFromShelf);
router.delete('/:id', deleteShelf);

export default router;
