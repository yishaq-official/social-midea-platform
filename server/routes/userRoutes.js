import express from 'express';
import { getUserProfile, toggleFollow, togglePrivacy } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserProfile);
router.post('/:id/follow', protect, toggleFollow);
router.put('/privacy', protect, togglePrivacy);

export default router;
