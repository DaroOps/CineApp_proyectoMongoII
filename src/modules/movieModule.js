import { ObjectId } from 'mongodb';
import DbService from '../db/dbConection.js';

export default class Movie {
    static instanceMovie
    adminClient;
    dbService;
    constructor(client = null) {
        if (Movie.instanceMovie) {
            return Movie.instanceMovie;
        }
        this.client = client.getClient();
        this.dbService = new DbService(this.client);
        Movie.instanceMovie = this;
    }

    async getMovieDetails(movieId) {
        try {
            const db = await this.dbService.connect();
            const movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId)});
            return movie;
        } catch (error) {
            console.error('Error getting movie details:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }

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

