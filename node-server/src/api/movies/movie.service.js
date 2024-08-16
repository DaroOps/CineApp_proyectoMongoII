// movie.service.js
import Movie from './movie.model.js';

import { MovieListDTO, MovieDetailDTO, AvailableSeatDTO } from './movie.dto.js';

export default class MovieService {
  async getMovieById(movie_id) {
    const movie = await Movie.findById(movie_id)
      .populate({ path: 'cast.actor_id', model: 'Actor' })
      .lean();
    
    if (!movie) return null;

    return new MovieDetailDTO(movie);
  }

  async listMovies() {
    const movies = await Movie.find().select('_id title genre image_url');
    return movies.map(movie => new MovieListDTO(movie));
  }

  async listAvailableSeats(screeningId) {
    try {
      // ... (lógica previa sin cambios)

      return availableSeats.map(seat => new AvailableSeatDTO(seat));
    } catch (error) {
      console.error('Error listing available seats:', error);
      throw error;
    }
  }
}