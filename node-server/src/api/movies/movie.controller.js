import MovieService from "./movie.service.js";

export default class MovieController {
  constructor() {
    this.movieService = new MovieService();
  }

  getMovieById = async (req, res) => {
    const { movie_id } = req.params;
    const movieDetails = await this.movieService.getMovieById(movie_id);
    res.json(movieDetails);
  };

  listMovies = async (req, res) => {
    const movies = await this.movieService.listMovies();
    res.json(movies);
  };

  getComingSoonMovies = async (req, res) => {
    const comingSoonMovies = await this.movieService.listMoviesWithoutScreenings(req.query.page, req.query.limit);
    res.json(comingSoonMovies);
  };

  searchMovies = async (req, res) => {
    const { query } = req.query;
    console.log('Searching for:', query);
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const searchResults = await this.movieService.searchMovies(query);
    res.json(searchResults);
  };

}