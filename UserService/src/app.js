import express from 'express';
import cors from 'cors'; // use import, não require
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3008', 'http://127.0.0.1:3008'], // frontend
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

app.use(userRoutes);

export default app;
