import ScreeningService from "./screening.service.js";

export default class ScreeningController {
  constructor() {
    this.screeningService = new ScreeningService();
  }

  getScreeningsForCinema = async (req, res) => {
    const { movieId, cinemaId } = req.params;
    const screenings = await this.screeningService.getScreeningsForCinemaAndMovie(cinemaId, movieId);
    res.json(screenings);
  };

}