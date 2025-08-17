import { Router } from "express";
import { ReservaController } from "../controllers/reserva.controller.js";

const reservaController = new ReservaController();
const router = Router();

router.get("/api/hello-world", reservaController.helloWorld);

router.post("/api/reserva", reservaController.reservar);

export default router;