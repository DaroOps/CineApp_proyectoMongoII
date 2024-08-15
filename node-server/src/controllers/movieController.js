import MovieService from "../services/movieService.js";

export default class MovieController {
    constructor() {
      this.movieService = new MovieService();
    }
  
    getMovieDetails = async (req, res) => {
        const { movieId } = req.params;
        const movieDetails = await this.movieService.getMovieDetails(movieId);
        res.json(movieDetails);
    };

    getMovieById = async (req, res) => {
        const { movie_id } = req.params;
        const movieDetails = await this.movieService.getMovieById(movie_id);
        res.json(movieDetails);
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
  