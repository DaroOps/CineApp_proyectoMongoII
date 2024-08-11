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

    /**
     * Retrieves a list of available seats for a specific screening.
     *
     * @param {string} screeningId - The unique identifier of the screening.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of available seat objects.
     * Each seat object contains the following properties:
     * - row: The row number of the seat.
     * - number: The seat number within the row.
     * - type: 'standard' or 'VIP'
     *
     * @throws {Error} If an error occurs while retrieving the available seats.
     */
    async listAvailableSeats(screeningId) {
        const db = await this.dbService.connect();
        try {
            const screening = await db.collection('screenings').findOne(
                { _id: new ObjectId(screeningId) }
            );
    
            if (!screening) {
                throw new Error('Screening not found');
            }
    
            const theater = await db.collection('theaters').findOne(
                { _id: new ObjectId(screening.theater_id) }
            );
    
            if (!theater) {
                throw new Error('Theater not found');
            }
    
            const occupiedSeats = await db.collection('tickets').find(
                { screening_id: new ObjectId(screeningId) },
                { projection: { seat: 1, _id: 0 } }
            ).toArray();
    
            const occupiedSeatsSet = new Set(
                occupiedSeats.map(ticket => `${ticket.seat.row}-${ticket.seat.number}`)
            );
            const availableSeats = theater.seats.filter(seat => 
                !occupiedSeatsSet.has(`${seat.row}-${seat.number}`)
            );
    
            availableSeats.sort((a, b) => {
                if (a.row !== b.row) {
                    return a.row.localeCompare(b.row);
                }
                return a.number - b.number;
            });
    
            return availableSeats;
        } catch (error) {
            console.error('Error listing available seats:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }
}

