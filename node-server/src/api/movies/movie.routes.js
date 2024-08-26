import express from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import MovieController from './movie.controller.js';


const router = express.Router();

const movieController = new MovieController();

router.get('/', asyncHandler(movieController.listMovies));
router.get('/:movie_id', asyncHandler(movieController.getMovieById));
router.get('/v1/coming-soon', asyncHandler(movieController.getComingSoonMovies));
router.get('/v1/search', asyncHandler(movieController.searchMovies));

export default router;