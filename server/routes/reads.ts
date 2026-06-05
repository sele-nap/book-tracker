import { Router } from 'express';
import {
  deleteUserRead,
  getUserReadByBook,
  getUserReads,
  getUserReadsByStatus,
  getUserReadsTimeline,
  patchUserRead,
  postUserRead,
} from '../controllers/readController.js';
import { validate } from '../utils/validate.js';
import {
  createReadSchema,
  updateReadSchema,
} from '../validators/readValidator.js';

const router = Router();

router.get('/', getUserReads);
router.get('/timeline', getUserReadsTimeline);
router.get('/status/:status', getUserReadsByStatus);
router.get('/book/:bookId', getUserReadByBook);
router.post('/', validate(createReadSchema), postUserRead);
router.patch('/:id', validate(updateReadSchema), patchUserRead);
router.delete('/:id', deleteUserRead);

export default router;
