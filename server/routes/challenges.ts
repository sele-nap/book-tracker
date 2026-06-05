import { Router } from 'express';
import {
  getUserChallengeProgress,
  getUserChallenges,
  patchUserChallengeBook,
  postUserChallenge,
} from '../controllers/challengeController.js';
import { validate } from '../utils/validate.js';
import { createChallengeSchema } from '../validators/challengeValidator.js';

const router = Router();

router.get('/', getUserChallenges);
router.post('/', validate(createChallengeSchema), postUserChallenge);
router.get('/:id/progress', getUserChallengeProgress);
router.patch('/:id/books/:bookId', patchUserChallengeBook);

export default router;
