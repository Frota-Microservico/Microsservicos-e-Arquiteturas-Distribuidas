import express from 'express';
import notificacaoRoutes from './routes/notificacao.routes.js';

const app = express();
app.use(express.json());

app.use(notificacaoRoutes);

export default app;
