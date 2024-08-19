import express from 'express';
import cors from 'cors';

import userRouter from './src/api/users/user.routes.js';
import movieRouter from './src/api/movies/movie.routes.js';
import screeningRouter from './src/api/screenings/screening.routes.js';
import theaterRouter from './src/api/theaters/theater.routes.js';
import ticketRouter from './src/api/tickets/ticket.routes.js';

// import registerRouter from './src/routes/register.js';
import connectDB from './src/config/database.js';

import mongoose from 'mongoose';

const app = express();
const port = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false
}));

console.log('Registered Models:', mongoose.modelNames());


app.get('/', (req, res) => {
  res.send('Healt Check: OK');
});

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/screenings', screeningRouter);
app.use('/api/theaters', theaterRouter);
app.use('/api/tickets', ticketRouter);
// app.use('/register', registerRouter);


// app.use('login', loginRouter);
// app.use('register', registerRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});