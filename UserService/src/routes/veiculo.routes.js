import { Router } from "express";
import { VeiculoController } from "../controllers/veiculo.controller.js";

const veiculoController = new VeiculoController();
const router = Router();

router.get("/api/hello-world", veiculoController.helloWorld);

router.post("/api/veiculo", veiculoController.createVeiculo);

export default router;