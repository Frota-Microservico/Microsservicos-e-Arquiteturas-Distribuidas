import { Router } from "express";
import { HistoricoController } from "../controllers/historico.controller.js";

const historicoController = new HistoricoController();
const router = Router();

router.get("/api/historico", historicoController.listarHistorico);

router.get("/api/historico/user/:id", historicoController.pesquisaHistorico);


export default router;