import { Router } from 'express';
import {
  readsByMonth,
  readsByGenre,
  avgRatingByGenre,
  globalStats,
  streak,
} from '../controllers/statsController.js';

const router = Router();

router.get('/by-month', readsByMonth);
router.get('/by-genre', readsByGenre);
router.get('/ratings-by-genre', avgRatingByGenre);
router.get('/global', globalStats);
router.get('/streak', streak);

export default router;
