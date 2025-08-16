import { Router } from "express";
import { VeiculoController } from "../controllers/veiculo.controller.js";

const veiculoController = new VeiculoController();
const router = Router();

router.get("/api/hello-world", veiculoController.helloWorld);

export default router;