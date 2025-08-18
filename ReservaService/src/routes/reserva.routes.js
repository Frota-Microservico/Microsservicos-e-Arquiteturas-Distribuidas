import { Router } from "express";
import { ReservaController } from "../controllers/reserva.controller.js";

const reservaController = new ReservaController();
const router = Router();

router.get("/api/hello-world", reservaController.helloWorld);

router.post("/api/reservas", reservaController.reservar);

router.get("/api/reservas", reservaController.listarReserva);

router.get("/api/reservas/:id", reservaController.procurarReserva);

router.delete("/api/reservas/:id", reservaController.deletaReserva);

router.put("/api/reservas/:id", reservaController.updateReserva);

export default router;