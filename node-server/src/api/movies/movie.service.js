// movie.service.js
import Movie from './movie.model.js';
import Cinema from '../cinemas/cinema.model.js';
import Actor from '../actors/actor.model.js';

import ScreeningService from '../screenings/screening.service.js';

import { MovieListDTO, MovieDetailDTO, AvailableSeatDTO } from './movie.dto.js';


export default class MovieService {
  async getMovieById(movie_id) {
    const movie = await Movie.findById(movie_id)
      .populate({ path: 'cast.actor_id', model: 'Actor' })
      .lean();

      console.log('Movie:', movie);
      if (!movie) return null;
      
      const screenings = await new ScreeningService().getScreeningsForMovie(movie_id);
      
      const uniqueScreenings = Array.from(new Set(screenings.map(s => JSON.stringify({ cinema_id: s.cinema_id }))))
      .map(s => JSON.parse(s));

      console.log('Screenings:', screenings);
      
    const movieWithScreenings = {
              ...movie,
               screenings: uniqueScreenings 
    };

    return new MovieDetailDTO(movieWithScreenings);
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

// // movie.service.js
// import Movie from '../models/movie.model.js';
// import ScreeningService from './screening.service.js';
// import { MovieDetailDTO } from './movie.dto.js';

// export default class MovieService {
//   async getMovieById(movie_id) {
//     const movie = await Movie.findById(movie_id)
//       .populate({ 
//         path: 'cast.actor_id', 
//         model: 'Actor' 
//       })
//       .lean();
    
//     if (!movie) return null;

//     const screenings = await ScreeningService.getScreeningsForMovie(movie_id);

//     const movieWithScreenings = {
//       ...movie,
//       screenings
//     };

//     return new MovieDetailDTO(movieWithScreenings);
//   }
// }