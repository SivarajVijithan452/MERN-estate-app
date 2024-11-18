import express from 'express';
import { updateUser, deleteImage } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/update', verifyToken, updateUser);
router.post('/delete-image', verifyToken, deleteImage);

export default router;
