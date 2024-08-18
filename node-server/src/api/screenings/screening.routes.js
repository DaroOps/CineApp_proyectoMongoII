import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import ScreeningController from './screening.controller.js';


const router = express.Router();

const screeningController = new ScreeningController();

// router.get('/', asyncHandler(movieController.listMovies));
router.get('/:movieId/:cinemaId', asyncHandler(screeningController.getScreeningsForCinema));

export default router;