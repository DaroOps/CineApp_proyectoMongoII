import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
// import authenticateToken from '../../middlewares/jwtAuthHandler.js';
import AuthController from './auth.controller.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/verify', asyncHandler(authController.verify));
router.post('/logout', asyncHandler(authController.logout));
router.post('/register', asyncHandler(authController.createUser));

export default router;