import { MongoClient } from 'mongodb';

class Client{
  constructor(user, pwd){
    this.uri = `${process.env.MONGO_PROTOCOL}://${encodeURIComponent(user)}:${encodeURIComponent(pwd)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}?replicaSet=${process.env.REPLICA_SET_NAME}`;
    // this.uri = `${process.env.MONGO_PROT}${user}:${pwd}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}?replicaSet=rs`
    console.log(this.uri);
  }

  /**
  * Creates a new MongoClient instance with the provided URI and connection options.
  *
  * @returns {MongoClient} A new MongoClient instance.
  *
  * @throws Will throw an error if the MongoClient instance cannot be created.
  *
  * @example
  * const client = getClient();
  * await client.connect();
  * const db = client.db();
  * // Perform database operations...
  * await client.close();
  */
  getClient(){
      return new MongoClient( this.uri, {
        connectTimeoutMS: 5000, 
        socketTimeoutMS: 30000,  
      });
  }

}

export default Client;