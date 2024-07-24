import Movie  from "./src/modules/movieModule.js";
import Client from "./src/config/mongodb.js";


const adminClient = new Client(process.env.ADMIN_USER, process.env.ADMIN_PWD);
const stanUserClient = new Client().getClient();
const vipUserClient  = new Client().getClient();

const movieControllerInstance = new Movie(adminClient);

console.log( await movieControllerInstance.listMovies());