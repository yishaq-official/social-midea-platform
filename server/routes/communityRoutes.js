import express from 'express';
import { createCommunity, getCommunities, joinCommunity } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCommunities).post(protect, createCommunity);
router.route('/:id/join').put(protect, joinCommunity);

export default router;
