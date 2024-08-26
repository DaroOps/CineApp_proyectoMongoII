import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import TheaterController from './theater.controller.js';


const router = express.Router();

const theaterController = new TheaterController();

router.get('/', asyncHandler(theaterController.getTheaters));


export default router;