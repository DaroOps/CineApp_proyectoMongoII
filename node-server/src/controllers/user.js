// import User from '../models/userModel.js';
// import Client from '../config/mongodb.js';

// export default class UserController {
//     constructor(client = new Client(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PWD)) {
//         this.client = client;
//     }

//     async createUser({ userData }) {
//         const user = new User(this.client);
//         // TODO: protect the creration of users with privleged roles (admin, vip)
//         userData.role = 'standard'; 
//         return await user.createUser(userData);
//     }
// }