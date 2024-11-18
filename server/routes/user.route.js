import express from 'express';
import { updateUser, deleteImage, updateUserInfo } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/update', verifyToken, updateUser);
router.post('/delete-image', verifyToken, deleteImage);
router.put('/update/:id', verifyToken, updateUserInfo);


export default router;
