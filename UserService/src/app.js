import express from 'express';
import veiculoRoutes from './routes/veiculo.routes.js';

const app = express();
app.use(express.json());

app.use(veiculoRoutes);

export default app;
