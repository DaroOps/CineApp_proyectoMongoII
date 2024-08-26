import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import UserController from './user.controller.js';
import upload from '../../config/multer.js';

const router = express.Router();
const userController = new UserController();

router.get('/:id', asyncHandler(userController.getUser));
router.post('/register', asyncHandler(userController.createUser));
router.put('/:id', upload.single('profileImage'), asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));
router.post('/become-vip/:id', asyncHandler(userController.becomeVIP));

export default router;