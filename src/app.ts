import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { error } from 'console';
import { Err } from 'joi';
import registerRoute from './routes/userRoute';
import { testRoute } from './controllers/userController';

dotenv.config();

// console.log(process.env);

const app: Express = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', registerRoute);
app.use('/api/blogs', registerRoute);

const port = process.env.PORT || 8000;
const MONGO_URI: string = process.env.MONGO_URI || '';

const server = http.createServer(app);

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
// mongoose.connection.on('error', (error: Error) => console.log('Moongoose Error', error));
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to your DB!');
});

mongoose.connection.on('error', (error: Error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from your DB');
});

// app.get('/', (req, res) => {
//   res.send('Express + Typescript is up and running on the server!!');
// });

server.listen(port, () => {
  console.log(`Server is running now at http://localhost:${port}`);
});
