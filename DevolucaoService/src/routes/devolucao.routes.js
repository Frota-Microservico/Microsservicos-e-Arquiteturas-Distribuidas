import { Router } from "express";
import { DevolucaoController } from "../controllers/devolucao.controller.js";

const devolucaoController = new DevolucaoController();
const router = Router();

router.put("/api/devolucao", devolucaoController.realizaDevolucao);

router.get("/api/devolucao", devolucaoController.listarDevolucao);


export default router;