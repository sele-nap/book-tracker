import { Router } from 'express';
import {
  getReads,
  getReadsByStatus,
  createRead,
  updateRead,
  deleteRead,
} from '../controllers/readController.js';

const router = Router();

router.get('/', getReads);
router.get('/status/:status', getReadsByStatus);
router.post('/', createRead);
router.patch('/:id', updateRead);
router.delete('/:id', deleteRead);

export default router;
