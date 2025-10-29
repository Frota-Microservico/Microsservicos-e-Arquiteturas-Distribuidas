import express from 'express';
import cors from 'cors'; // use import, não require
import reservaRoutes from './routes/reserva.routes.js';
import { metricsMiddleware } from './metrics.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3008', 'http://127.0.0.1:3008'], // frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log("REQ RECEBIDA:", req.method, req.url);
  console.log("BODY:", req.body);
  next();
});

app.use(express.json());

const SERVICE_NAME = 'reserva-service';
app.use(metricsMiddleware(SERVICE_NAME));

app.use(reservaRoutes);


export default app;
