import { Router } from "express";
import { VeiculoController } from "../controllers/veiculo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { metricsEndpoint } from '../../../metrics.js';

const veiculoController = new VeiculoController();
const router = Router();

router.post("/api/veiculos", authMiddleware(false), veiculoController.createVeiculo); // Cadastrar um veículo

router.get("/api/veiculo", authMiddleware(false), veiculoController.listarVeiculos); // Listar todos os veículos

router.get("/api/veiculo/:id", authMiddleware(false), veiculoController.procurarVeiculo); // Procurar um veículo pelo ID

router.delete("/api/veiculo/:id", authMiddleware(false), veiculoController.deletaVeiculo); // Deletar um veículo pelo ID

router.put("/api/veiculo/:id", authMiddleware(false), veiculoController.updateVeiculo); // Atualizar um veículo pelo ID

router.get('/metrics', metricsEndpoint);

export default router;