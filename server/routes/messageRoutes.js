import express from 'express';
import { getContacts, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/contacts', protect, getContacts);
router.get('/:userId', protect, getMessages);

export default router;
