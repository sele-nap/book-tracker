import { Router } from 'express';
import {
  addBookToChallenge,
  createChallenge,
  getChallengeProgress,
  getChallenges,
} from '../controllers/challengeController.js';
import { validate } from '../utils/validate.js';
import { createChallengeSchema } from '../validators/challengeValidator.js';

const router = Router();

router.get('/', getChallenges);
router.post('/', validate(createChallengeSchema), createChallenge);
router.get('/:id/progress', getChallengeProgress);
router.patch('/:id/books/:bookId', addBookToChallenge);

export default router;
