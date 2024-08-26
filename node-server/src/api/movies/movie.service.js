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

  
}
