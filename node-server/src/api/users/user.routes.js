import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import UserController from './user.controller.js';

const router = express.Router();
const userController = new UserController();

//TODO: Add middleware to check if user is logged in
//TODO: fix the dto when getting user by id
router.get('/:id', asyncHandler(userController.getUser));
router.post('/register', asyncHandler(userController.createUser));
router.put('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;