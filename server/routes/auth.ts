import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  deleteUserMe,
  getUserMe,
  patchUserMe,
  postPublicLogin,
  postPublicRegister,
  postUserLogout,
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

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  postPublicRegister,
);
router.post('/login', authLimiter, validate(loginSchema), postPublicLogin);
router.get('/me', requireAuth, getUserMe);
router.patch(
  '/me',
  requireAuth,
  authLimiter,
  validate(updateMeSchema),
  patchUserMe,
);
router.delete(
  '/me',
  requireAuth,
  authLimiter,
  validate(deleteMeSchema),
  deleteUserMe,
);
router.post('/logout', requireAuth, postUserLogout);

export default router;
