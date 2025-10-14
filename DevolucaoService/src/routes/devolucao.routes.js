import { Router } from "express";
import { DevolucaoController } from "../controllers/devolucao.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const devolucaoController = new DevolucaoController();
const router = Router();

router.put("/api/devolucao", authMiddleware(false), devolucaoController.realizaDevolucao);

router.get("/api/devolucao", authMiddleware(false), devolucaoController.listarDevolucao);


export default router;