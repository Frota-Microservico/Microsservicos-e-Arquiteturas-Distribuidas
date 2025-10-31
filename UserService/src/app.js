import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import { metricsMiddleware } from './metrics.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3008', 'http://127.0.0.1:3008'], // frontend
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

const SERVICE_NAME = 'user-service';
app.use(metricsMiddleware(SERVICE_NAME));

app.use(userRoutes);

export default app;
