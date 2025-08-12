import express from 'express';
import reservaRoutes from './routes/reserva.routes.js';

const app = express();
app.use(express.json());

app.use(reservaRoutes);

export default app;
