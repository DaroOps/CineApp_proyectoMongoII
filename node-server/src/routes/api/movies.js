import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import MovieController from '../../controllers/movieController.js';


const router = express.Router();

const movieController = new MovieController();

router.get('/', asyncHandler(movieController.listMovies));

export default router;