import express from 'express';
import cors from 'cors';

import userRouter from './src/routes/api/users.js';
import movieRouter from './src/api/movies/movie.routes.js';

import registerRouter from './src/routes/register.js';
import connectDB from './src/config/database.js';

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

app.get('/', (req, res) => {
  res.send('Healt Check: OK');
});

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter)
app.use('/register', registerRouter);

// app.use('login', loginRouter);
// app.use('register', registerRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});