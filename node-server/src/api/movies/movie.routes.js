import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import MovieController from './movie.controller.js';


const router = express.Router();

const movieController = new MovieController();

router.get('/', asyncHandler(movieController.listMovies));
router.get('/:movie_id', asyncHandler(movieController.getMovieById));


export default router;