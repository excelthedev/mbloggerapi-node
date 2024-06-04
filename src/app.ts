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
import blogRoute from './routes/blogRoute';
import { testRoute } from './controllers/userController';

dotenv.config();

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
app.use('/api/blogs', blogRoute);

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

server.listen(port, () => {
  console.log(`Server is running now at http://localhost:${port}`);
});
