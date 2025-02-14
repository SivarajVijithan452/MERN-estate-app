import express from 'express';
import { updateUser, deleteImage, updateUserInfo, deleteUser, getUserListings, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/update', verifyToken, updateUser);
router.post('/delete-image', verifyToken, deleteImage);
router.put('/update/:id', verifyToken, updateUserInfo);
router.delete('/delete-user/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

export default router;
