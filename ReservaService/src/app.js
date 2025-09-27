import express from 'express';
import cors from 'cors'; // use import, não require
import reservaRoutes from './routes/reserva.routes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // frontend
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

app.use(reservaRoutes);

export default app;
