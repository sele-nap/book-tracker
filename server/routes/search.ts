import { Router } from 'express';
import { searchExternalBooks } from '../services/externalSearchService.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? '').trim();
    if (!q) {
      res.json([]);
      return;
    }
    if (q.length > 200) {
      res.status(400).json({ errors: [{ id: 'q', type: 'max-200' }] });
      return;
    }
    const results = await searchExternalBooks(q);
    res.json(results);
  }),
);

export default router;
