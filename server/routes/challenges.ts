import { Router } from 'express';
import {
  addBookToChallenge,
  createChallenge,
  getChallengeProgress,
  getChallenges,
} from '../controllers/challengeController.js';

const router = Router();

router.get('/', getChallenges);
router.post('/', createChallenge);
router.get('/:id/progress', getChallengeProgress);
router.patch('/:id/books/:bookId', addBookToChallenge);

export default router;
