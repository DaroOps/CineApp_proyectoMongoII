// movie.service.js
import Movie from './movie.model.js';
import Cinema from '../cinemas/cinema.model.js'; //Needed 
import Actor from '../actors/actor.model.js'; //Needed

import ScreeningService from '../screenings/screening.service.js';

import { MovieListDTO, MovieDetailDTO, AvailableSeatDTO } from './movie.dto.js';
import mongoose from 'mongoose';


export default class MovieService {
  async getMovieById(movie_id) {
    const movie = await Movie.findById(movie_id)
      .populate({ path: 'cast.actor_id', model: 'Actor' })
      .lean();

      // console.log('Movie:', movie);
      if (!movie) return null;
      
      const screenings = await new ScreeningService().getScreeningsForMovie(movie_id);
      
      const uniqueScreenings = Array.from(new Set(screenings.map(s => JSON.stringify({ cinema_id: s.cinema_id }))))
      .map(s => JSON.parse(s));

      // console.log('Screenings:', screenings);
      
    const movieWithScreenings = {
              ...movie,
               screenings: uniqueScreenings 
    };

    return new MovieDetailDTO(movieWithScreenings);
  }
  

  async listMovies() {
    const Screenings = mongoose.model('Screening');
    const screenings = await Screenings.find().distinct('movie_id');
  
    const movies = await Movie.find({ _id: { $in: screenings } })
      .select('_id title genre image_url')
      .limit(5);
  
    return movies.map(movie => new MovieListDTO(movie));
  }

  async listMoviesWithoutScreenings(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const Screenings = mongoose.model('Screening');
    const screenings = await Screenings.find().distinct('movie_id');
    
    const movies = await Movie.find({ _id: { $nin: screenings } })
      .select('_id title genre image_url')
      .skip(skip)
      .limit(limit);
  
    const total = await Movie.countDocuments({ _id: { $nin: screenings } });
  
    return {
      movies: movies.map(movie => new MovieListDTO(movie)),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    };
  }

  async searchMovies(query) {
    const Actor = mongoose.model('Actor');
    const Cinema = mongoose.model('Cinema');
    const Movie = mongoose.model('Movie');
  
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
  
    const actors = await Actor.find({ name: { $regex: query, $options: 'i' } }).limit(5);
  
    const actorMovies = await Promise.all(actors.map(async (actor) => {
      const movies = await Movie.find({ 'cast.actor_id': actor._id }).limit(2);
      return {
        actor: actor,
        movies: movies.map(movie => new MovieListDTO(movie))
      };
    }));
  
    const cinemas = await Cinema.find({ name: { $regex: query, $options: 'i' } }).limit(5);
  
    return {
      movies: movies.map(movie => new MovieListDTO(movie)),
      actorMovies: actorMovies,
      actors: actors,
      cinemas: cinemas
    };
  }
}
