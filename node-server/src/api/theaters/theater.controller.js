import TheaterService from "./theater.service.js";

export default class ScreeningController {
  constructor() {
    this.heaterService = new TheaterService();
  }

  getTheaters = async (req, res) => {
    const theaters = await this.heaterService.getTheaters();
    res.json(theaters);
  };
}