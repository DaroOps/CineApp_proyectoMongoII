import { ObjectId } from 'mongodb';
import DbService from '../db/dbConnection.js';

export default class Movie {
    static instanceMovie
    client;
    dbService;
    /**
     * Creates a new Movie instance or returns the existing instance (Singleton pattern).
     * 
     * @param {Object} client - The database client object.
     * @returns {Movie} The Movie instance.
     */
    constructor(client = null) {
        if (Movie.instanceMovie) {
            return Movie.instanceMovie;
        }
        this.client = client.getClient();
        this.dbService = new DbService(this.client);
        Movie.instanceMovie = this;
    }

    /**
     * Retrieves the details of a movie from the database.
     *
     * @param {string} movieId - The unique identifier of the movie.
     *
     * @returns {Promise<Object>|null>} A promise that resolves to a movie object.
     * The movie object contains the following properties:
     * - _id: The unique identifier of the movie.
     * - movie_id: The unique identifier of the movie.
     * - theater_id: The unique identifier of the theater.
     * - date_time: The date and time of the screening.
     * - base_price: The base price of the ticket.
     * - available_seats: The number of available seats.
     * - occupied_seats: An array of occupied seat numbers.
     *
     * @throws {Error} If an error occurs while retrieving the movie details.
     */
    async getMovieDetails(movieId) {
        try {
            const db = await this.dbService.connect();
            const movie = await db.collection('screenings').findOne({ movie_id: new ObjectId(movieId)});
            return movie;
        } catch (error) {
            console.error('Error getting movie details:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }

    /**
     * Retrieves a list of all movies from the database.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of movie objects.
     * Each movie object contains the following properties:
     * - _id: The unique identifier of the movie.
     * - title: The title of the movie.
     * - genre: The genre of the movie.
     * - duration: The duration of the movie in minutes.
     * - synopsis: The synopsis of the movie.
     * - screening_times: An array of screening times for the movie.
     *
     * @throws {Error} If an error occurs while retrieving the movies.
     */
    async  listMovies() {
        try {
            const db = await this.dbService.connect();
            const movies = await db.collection('movies').find({}).toArray();
            return movies;
        } catch (error) {
            console.error('Error listing movies:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }
}

