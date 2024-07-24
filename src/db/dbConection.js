class DbService {
  constructor(client) {
    this.client = client;
    this.db = null;
  }

  /**
   * Connects to the MongoDB database using the provided client.
   * If the database is already connected, this function does nothing.
   *
   * @returns {Promise<import('mongodb').Db>} The connected MongoDB database.
   * @throws {Error} If the connection fails.
   */
  async connect() {
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db(process.env.DB_NAME);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      }
    }
    return this.db;
  }

  /**
   * Retrieves the connected MongoDB database.
   * If the database is not yet connected, this function throws an error.
   *
   * @returns {import('mongodb').Db} The connected MongoDB database.
   * @throws {Error} If the database is not connected.
   */
  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Closes the MongoDB connection.
   * If the connection is already closed, this function does nothing.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is closed.
   */
  async close() {
    if (this.client) {
      await this.client.close();
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }
}

export default DbService;