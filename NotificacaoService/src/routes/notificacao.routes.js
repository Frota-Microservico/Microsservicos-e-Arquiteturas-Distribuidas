import { Router } from "express";
import { NotificacaoController } from "../controllers/notificacao.controller.js";

const notificacaoController = new NotificacaoController();
const router = Router();

router.get("/api/notificao", notificacaoController.notificarUsuario);

export default router;