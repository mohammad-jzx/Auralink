import express from 'express';
import { kidsSeedData, updateProgress } from './seed';
import { ProgressUpdate } from './types';

const router = express.Router();

// GET /api/kids/seed - Returns seed data
router.get('/seed', (req, res) => {
  try {
    res.json(kidsSeedData);
  } catch (error) {
    console.error('Error fetching seed data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/kids/progress - Updates progress
router.post('/progress', (req, res) => {
  try {
    const update: ProgressUpdate = req.body;
    
    if (!update.childId) {
      return res.status(400).json({ error: 'childId is required' });
    }

    const updatedData = updateProgress(update);
    
    res.json({
      success: true,
      profile: updatedData.profile,
      progress: updatedData.progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/kids/health - Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'kids-learning-api'
  });
});

export default router;