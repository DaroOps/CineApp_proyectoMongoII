import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import {} from './src/api/index.js';
import connectDB from './src/config/database.js';
import mongoose from 'mongoose';
import userRouter from './src/api/users/user.routes.js';
import movieRouter from './src/api/movies/movie.routes.js';
import screeningRouter from './src/api/screenings/screening.routes.js';
import theaterRouter from './src/api/theaters/theater.routes.js';
import ticketRouter from './src/api/tickets/ticket.routes.js';
import authRouter from './src/api/auth/auth.routes.js';
import errorHandler from './src/middlewares/errorHandler.js';
import authenticateToken from './src/middlewares/jwtAuthHandler.js';


const app = express();
const server = http.createServer(app);  
const io = new Server(server, { 
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }
});

const port = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173','http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

console.log('Registered Models:', mongoose.modelNames());

app.get('/', (req, res) => {
  res.send('Health Check: OK');
});

app.use('/api/auth', authRouter);
app.use('/api/users', authenticateToken ,userRouter);//TODO: protect api routes! app.use('/api/users', authenticateToken, userRouter);
app.use('/api/movies',authenticateToken , movieRouter);
app.use('/api/screenings',authenticateToken , screeningRouter);
app.use('/api/theaters',authenticateToken , theaterRouter);
app.use('/api/tickets', authenticateToken ,ticketRouter);


io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinRoom', (screeningId) => {
    console.log(`Client joined room: ${screeningId}`);
    socket.join(screeningId);
  });

  socket.on('leaveRoom', (screeningId) => {
    console.log(`Client left room: ${screeningId}`);
    socket.leave(screeningId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


export { io };