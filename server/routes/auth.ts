import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  deleteMe,
  login,
  logout,
  me,
  register,
  updateMe,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../utils/validate.js';
import {
  deleteMeSchema,
  loginSchema,
  registerSchema,
  updateMeSchema,
} from '../validators/authValidator.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, validate(updateMeSchema), updateMe);
router.delete('/me', requireAuth, validate(deleteMeSchema), deleteMe);
router.post('/logout', requireAuth, logout);

export default router;
