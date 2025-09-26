import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { translateText } from '../translateClient';

const router = express.Router();

const limiter = rateLimit({ windowMs: 60_000, max: 60 });

router.use(limiter);

router.post('/api/translate', cors(), async (req, res) => {
  try {
    const { q, target } = req.body as { q: string | string[]; target: 'ar' | 'en' };
    if (!q || (Array.isArray(q) && q.length === 0)) {
      return res.status(400).json({ error: 'Missing q' });
    }
    if (target !== 'ar' && target !== 'en') {
      return res.status(400).json({ error: 'Invalid target' });
    }
    const result = await translateText(q, target);
    const translations = Array.isArray(result) ? result : [result];
    res.json({ translations });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Translation failed' });
  }
});

export default router;















