import express from 'express';
import cors from 'cors';

import userRouter from './src/routes/api/users.js';
import registerRouter from './src/routes/register.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

app.get('/', (req, res) => {
  res.send('Healt Check: OK');
});

app.use('/api/users', userRouter);
app.use('/register', registerRouter);

// app.use('login', loginRouter);
// app.use('register', registerRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


// import Movie  from "./src/modules/movieModule.js";
// import Client from "./src/config/mongodb.js";
// import Ticket from "./src/modules/ticketModule.js";
// import User from "./src/modules/userModule.js";
// import Payment from "./src/modules/paymentModule.js";


// #region standard flow

    // const adminUserClient = new Client(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PWD);

    // const userControllerInstance = new User(adminUserClient);

    // console.log(await userControllerInstance.createUser(
    //     {
    //         name: 'JhonDoe',
    //         email: 'nuevo@ejemplo.com',
    //         password: '12345',
    //     },
    //     'standard'
    // ))

    // const standardUserClient = new Client(process.env.STAN_USER, process.env.STAN_PWD);

    // const movieControllerInstance = new Movie(standardUserClient);

    // const ticketControllerInstance = new Ticket(standardUserClient);

    // const paymentControllerInstance = new Payment(standardUserClient);

    // console.log( await movieControllerInstance.listMovies());

    // console.log( await movieControllerInstance.getMovieDetails("66a1293e41165c14ebdd4f6d"));

    // console.log( await ticketControllerInstance.checkSeatAvailability("66a1295d41165c14ebdd4f72"))

    // console.log(await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f72", "66a7f11fa04382cf46f74960", {theater_id: '66a1294d41165c14ebdd4f70' , row: 'A', number: 1 }));
    // console.log(await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f72", "66a7f11fa04382cf46f74960", {theater_id: '66a1294d41165c14ebdd4f70' , row: 'J', number: 200 }));

    // console.log(await paymentControllerInstance.processPayment("66a81738f4ffb38b4b597ef0", "cash"))

// #endregion standard flow

// #region VIP flow
    // const adminUserClient = new Client(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PWD);

    // const userControllerInstance = new User(adminUserClient);

    // console.log(await userControllerInstance.createUser(
    //     {
    //         name: 'JaneSmith',
    //         email: 'JaneSmith@ejemplo.com',
    //         password: '12345',
    //     },
    //     'VIP'
    // ))
    
    // const vipUserClient = new Client(process.env.VIP_USER, process.env.VIP_PWD);

    // const movieControllerInstance = new Movie(vipUserClient);

    // const ticketControllerInstance = new Ticket(vipUserClient);

    // const paymentControllerInstance = new Payment(vipUserClient);

    // console.log( await movieControllerInstance.listMovies());

    // console.log( await movieControllerInstance.getMovieDetails("66a1293e41165c14ebdd4f6f"));
    // console.log( await ticketControllerInstance.checkSeatAvailability("66a1295d41165c14ebdd4f74"))
    // console.log(await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f74", "66a81d3ddbf2c45a8545c8fc", {theater_id: '66a1295d41165c14ebdd4f74' , row: 'J', number: 200 }));
    // console.log(await ticketControllerInstance.buyTicket("66a1295d41165c14ebdd4f74", "66a81d3ddbf2c45a8545c8fc", {theater_id: '66a1295d41165c14ebdd4f74' , row: 'J', number: 200 }));
    // console.log(await paymentControllerInstance.verifyVIPCardAndApplyDiscount("66a81d3ddbf2c45a8545c8fc", "66a8265732a379907791c265"));
    // console.log(await paymentControllerInstance.processPayment("66a8265732a379907791c265", "cash"))

// #endregion VIP flow