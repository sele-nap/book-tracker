import { Router } from 'express';
import {
  createRead,
  deleteRead,
  getReadByBook,
  getReads,
  getReadsByStatus,
  getTimeline,
  updateRead,
} from '../controllers/readController.js';
import { validate } from '../utils/validate.js';
import {
  createReadSchema,
  updateReadSchema,
} from '../validators/readValidator.js';

const router = Router();

router.get('/', getReads);
router.get('/timeline', getTimeline);
router.get('/status/:status', getReadsByStatus);
router.get('/book/:bookId', getReadByBook);
router.post('/', validate(createReadSchema), createRead);
router.patch('/:id', validate(updateReadSchema), updateRead);
router.delete('/:id', deleteRead);

export default router;
