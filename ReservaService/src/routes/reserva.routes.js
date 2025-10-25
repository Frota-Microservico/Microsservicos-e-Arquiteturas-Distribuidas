import { Router } from "express";
import { ReservaController } from "../controllers/reserva.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { metricsEndpoint } from '../metrics.js';

const reservaController = new ReservaController();
const router = Router();

router.post("/api/reservas", authMiddleware(false), reservaController.reservar); // Cadastrar uma reserva de veiculo

router.get("/api/reservas", authMiddleware(false), reservaController.listarReserva);

router.get("/api/reservas/:id", authMiddleware(false), reservaController.procurarReserva);

router.delete("/api/reservas/:id", authMiddleware(false), reservaController.deletaReserva);

router.put("/api/reservas/:id", authMiddleware(false), reservaController.updateReserva);

router.get('/metrics', metricsEndpoint);

export default router;