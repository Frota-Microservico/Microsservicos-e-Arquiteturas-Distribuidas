import { Router } from "express";
import { ReservaController } from "../controllers/reserva.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { metricsEndpoint } from '../metrics.js';

const reservaController = new ReservaController();
const router = Router();

router.post("/api/reservas", reservaController.reservar); // Cadastrar uma reserva de veiculo

router.get("/api/reservas", reservaController.listarReserva);

router.delete("/api/reservas", reservaController.deletaReserva);

router.get("/api/reservas/:id", reservaController.procurarReserva);

router.put("/api/reservas/:id", reservaController.updateReserva);

router.get('/metrics', metricsEndpoint);

export default router;