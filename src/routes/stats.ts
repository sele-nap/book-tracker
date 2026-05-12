import { Router } from 'express';
import {
  readsByMonth,
  readsByGenre,
  avgRatingByGenre,
  globalStats,
} from '../controllers/statsController.js';

const router = Router();

router.get('/by-month', readsByMonth);
router.get('/by-genre', readsByGenre);
router.get('/ratings-by-genre', avgRatingByGenre);
router.get('/global', globalStats);

export default router;
