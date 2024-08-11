import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import UserController from '../controllers/user.js';


const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    const restult = await new UserController().createUser(req.body);
    res.status(201).json(restult);
}));

export default router;