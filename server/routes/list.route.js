import express from 'express'
import { createListing, deleteListing } from '../controllers/list.controller.js';
import { verifyToken } from './../utils/verifyUser.js';
const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);


export default router;
