// El Modelo: Sigue definiendo la estructura de los datos, pero a menudo se limita a representar los datos y las reglas de validación básicas.
// El Servicio: Toma gran parte de la responsabilidad de la lógica de negocio que tradicionalmente pertenecía al Modelo. Maneja operaciones complejas que involucran múltiples modelos o recursos.
// El Controlador: Se mantiene delgado, manejando principalmente la conversión de solicitudes HTTP en llamadas a servicios y la formateo de respuestas.

import Movie from '../models/movieModel.js';
import Screening from '../models/screeningModel.js';
import Theater from '../models/theaterModel.js';
import Ticket from '../models/ticketModel.js';
import Actor from '../models/actorModel.js';

export default class MovieService {
  async getMovieDetails(movieId) {
      const screening = await Screening.findOne({ movie_id: movieId }).populate('movie_id');
      return screening;
  }

  async getMovieById(movie_id) {
    const movie = await Movie.findById(movie_id)
    .populate({
        path: 'cast.actor_id',
        model: 'Actor'
      }).lean();
    console.log("one movie", movie);
    
    return movie;
}

  async listMovies() {
      const movies = await Movie.find().select('_id title genre image_url');;
      return movies;
  }

  async listAvailableSeats(screeningId) {
    try {
      const screening = await Screening.findById(screeningId);
      if (!screening) {
        throw new Error('Screening not found');
      }

      const theater = await Theater.findById(screening.theater_id);
      if (!theater) {
        throw new Error('Theater not found');
      }

      const occupiedSeats = await Ticket.find(
        { screening_id: screeningId },
        { 'seat.row': 1, 'seat.number': 1, _id: 0 }
      );

      const occupiedSeatsSet = new Set(
        occupiedSeats.map(ticket => `${ticket.seat.row}-${ticket.seat.number}`)
      );

      const availableSeats = theater.seats.filter(seat => 
        !occupiedSeatsSet.has(`${seat.row}-${seat.number}`)
      );

      availableSeats.sort((a, b) => {
        if (a.row !== b.row) {
          return a.row.localeCompare(b.row);
        }
        return a.number - b.number;
      });

      return availableSeats;
    } catch (error) {
      console.error('Error listing available seats:', error);
      throw error;
    }
  }
}