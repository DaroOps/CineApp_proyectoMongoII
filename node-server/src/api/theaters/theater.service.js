import Theater from './theater.model.js';

export default class TheaterService {
  async getTheaters() {
    const theaters = await Theater.find({}).lean();
    return theaters;
  }
}