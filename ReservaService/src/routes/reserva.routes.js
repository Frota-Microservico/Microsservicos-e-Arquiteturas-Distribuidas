import { Router } from "express";
import { ReservaController } from "../controllers/reserva.controller.js";

const reservaController = new ReservaController();
const router = Router();

router.post("/api/reservas", authMiddleware(false), reservaController.reservar); // Cadastrar uma reserva de veiculo

router.get("/api/reservas", authMiddleware(false), reservaController.listarReserva);

router.get("/api/reservas/:id", authMiddleware(false), reservaController.procurarReserva);

router.delete("/api/reservas/:id", authMiddleware(false), reservaController.deletaReserva);

router.put("/api/reservas/:id", authMiddleware(false), reservaController.updateReserva);

export default router;