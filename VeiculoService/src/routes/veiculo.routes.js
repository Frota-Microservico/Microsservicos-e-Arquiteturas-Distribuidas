import { Router } from "express";
import { VeiculoController } from "../controllers/veiculo.controller.js";

const veiculoController = new VeiculoController();
const router = Router();

router.post("/api/veiculo", veiculoController.createVeiculo);

router.get("/api/veiculo", veiculoController.listarVeiculos);

router.get("/api/veiculo/:id", veiculoController.procurarVeiculo);

router.delete("/api/veiculo/:id", veiculoController.deletaVeiculo);

router.put("/api/veiculo/:id", veiculoController.updateVeiculo);

export default router;