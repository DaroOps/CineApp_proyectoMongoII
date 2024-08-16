import Screening from './screening.model.js';
import { ScreeningDTO } from './screening.dto.js';

export default class ScreeningService {
    async getScreeningsForMovie(movieId) {
      const screenings = await Screening.find({ movie_id: movieId })
        .populate({ path: 'cinema_id', model: 'Cinema' })
        .lean();

        console.log('Screenings:', screenings);
        
      
      return screenings;
    }
}