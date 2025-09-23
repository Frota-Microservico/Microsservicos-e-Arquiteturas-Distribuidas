import { sendNotificacaoEvent } from "../kafka/producer.js";

export class NotificacaoController {
  async notificarUsuario(req, res) {
    try {
      const { to, subject, message } = req.body;

      if (!to || !subject || !message) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
      }

      await sendNotificacaoEvent("notificacao_topic", {
        to,
        subject,
        message,
        timestamp: new Date(),
      });

      return res.status(200).json({
        status: "queued",
        detail: "Notificação enviada para a fila Kafka",
      });
    } catch (error) {
      console.error("❌ Erro ao notificar usuário:", error);
      return res
        .status(500)
        .json({ status: 500, detail: "Erro interno do servidor" });
    }
  }
}
