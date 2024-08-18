import Screening from './screening.model.js';
import { ScreeningDTO } from './screening.dto.js';
import { formatDate } from '../../utils/date.js';

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
      // console.log('Screenings:', screenings);

      const formatScreenings = screenings.map(screening => {
        return {
          ...screening.toObject(),
          date_time: formatDate(screening.date_time),
        };
      });

      // console.log('Formated screenings:', formatScreenings);
      
      return formatScreenings.map(screening => new ScreeningDTO(screening));;
    }




}

