import { Router } from 'express';
import {
  getChallenges,
  createChallenge,
  addBookToChallenge,
  getChallengeProgress,
} from '../controllers/challengeController.js';

const router = Router();

router.get('/', getChallenges);
router.post('/', createChallenge);
router.get('/:id/progress', getChallengeProgress);
router.patch('/:id/books/:bookId', addBookToChallenge);

export default router;
