import express from 'express';
import historicoRoutes from './routes/historico.routes.js';

const app = express();
app.use(express.json());

app.use(historicoRoutes);

export default app;
