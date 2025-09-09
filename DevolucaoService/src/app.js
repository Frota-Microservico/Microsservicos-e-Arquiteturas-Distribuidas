import express from 'express';
import devolucaooRoutes from './routes/devolucao.routes.js';

const app = express();
app.use(express.json());

app.use(devolucaooRoutes);

export default app;
