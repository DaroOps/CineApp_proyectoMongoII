import { MongoClient } from 'mongodb';

class Client{
  constructor(user, pwd){
    // process.env.MONGO_PROT + user + ":" + pass + process.env.MONGO_HOST+ ":" +  + "/" + process.env.DB_NAME;
    this.uri = `${process.env.MONGO_PROT}${user}:${pwd}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`
    console.log(this.uri);
  }

  getClient(){
      return new MongoClient( this.uri, {
        connectTimeoutMS: 5000, 
        socketTimeoutMS: 30000,  
      });
  }

}

export default Client;