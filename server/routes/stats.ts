import { Router } from 'express';
import {
  getUserStatsByGenre,
  getUserStatsByMonth,
  getUserStatsGlobal,
  getUserStatsRatingsByGenre,
  getUserStatsStreak,
} from '../controllers/statsController.js';

const router = Router();

router.get('/by-month', getUserStatsByMonth);
router.get('/by-genre', getUserStatsByGenre);
router.get('/ratings-by-genre', getUserStatsRatingsByGenre);
router.get('/global', getUserStatsGlobal);
router.get('/streak', getUserStatsStreak);

export default router;
