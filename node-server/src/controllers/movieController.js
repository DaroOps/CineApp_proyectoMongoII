import MovieService from "../services/movieService.js";

export default class MovieController {
    constructor() {
      this.movieService = new MovieService();
    }
  
    getMovieDetails = async (req, res) => {
      try {
        const { movieId } = req.params;
        const movieDetails = await this.movieService.getMovieDetails(movieId);
        res.json(movieDetails);
      } catch (error) {
        res.status(500).json({ error: 'Error getting movie details' });
      }
    };
  
    listMovies = async (req, res) => {
        const movies = await this.movieService.listMovies();
        res.json(movies);
    };
  
    listAvailableSeats = async (req, res) => {
      try {
        const { screeningId } = req.params;
        const availableSeats = await this.movieService.listAvailableSeats(screeningId);
        res.json(availableSeats);
      } catch (error) {
        res.status(500).json({ error: 'Error listing available seats' });
      }
    };
  }
  