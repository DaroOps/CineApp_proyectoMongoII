import Screening from './screening.model.js';
import {FormatedScreeningDTO, ScreeningDTO } from './screening.dto.js';
import { formatDate } from '../../utils/date.js';
import Theater from '../theaters/theater.model.js';
import { TheaterSeatAdapter } from '../../utils/adapters/theaterSeat.adapter.js';

export default class ScreeningService {
    async getScreeningsForMovie(movieId) {
      const screenings = await Screening.find({ movie_id: movieId })
        .populate({ path: 'cinema_id', model: 'Cinema' })
        .lean();
        // console.log('Screenings:', screenings);
      
      return screenings;
    }

    async getScreeningsForCinemaAndMovie(cinemaId, movieId) {
      const screenings = await Screening.find({ cinema_id: cinemaId, movie_id: movieId })
      .populate({ path: 'theater_id', model: 'Theater' })
      .populate({ path: 'movie_id', model: 'Movie', select: 'title' })
      .populate({ path: 'cinema_id', model: 'Cinema' , select: 'name location' });
      // console.log('Screenings:', screenings);



      const formatScreenings = screenings.map(screening => {
        return {
          ...screening.toObject(),
          date_time: formatDate(screening.date_time),
        };
      });

     

      const formatSeats = formatScreenings.map(screening => {
        return {
          ...screening,
          seats: TheaterSeatAdapter.adapt(new ScreeningDTO(screening))
        };
      });
      
      // console.log('Formated screenings:', formatSeats);

      return formatSeats.map(screening =>  new FormatedScreeningDTO(screening));
    }




}

