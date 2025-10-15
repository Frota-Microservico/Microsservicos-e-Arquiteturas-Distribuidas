import { Router } from "express";
import { NotificacaoController } from "../controllers/notificacao.controller.js";

const router = Router();
const notificacaoController = new NotificacaoController();

router.post("/api/notificacao", (req, res) =>
  notificacaoController.notificarUsuario(req, res)
);

export default router;