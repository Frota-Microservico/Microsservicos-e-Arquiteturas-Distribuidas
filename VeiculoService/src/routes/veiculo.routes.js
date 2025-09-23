import { Router } from "express";
import { VeiculoController } from "../controllers/veiculo.controller.js";

const veiculoController = new VeiculoController();
const router = Router();

router.post("/api/veiculos", veiculoController.createVeiculo); // Cadastrar um veículo

router.get("/api/veiculo", veiculoController.listarVeiculos); // Listar todos os veículos

router.get("/api/veiculo/:id", veiculoController.procurarVeiculo); // Procurar um veículo pelo ID

router.delete("/api/veiculo/:id", veiculoController.deletaVeiculo); // Deletar um veículo pelo ID

router.put("/api/veiculo/:id", veiculoController.updateVeiculo); // Atualizar um veículo pelo ID

export default router;