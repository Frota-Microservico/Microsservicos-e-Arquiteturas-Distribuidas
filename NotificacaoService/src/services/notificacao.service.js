import nodemailer from "nodemailer";

export class NotificacaoService {
  static async enviarEmail({ to, subject, message }) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Notificação Serviço" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      console.log("E-mail enviado:", info.messageId);
      return info;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw error;
    }
  }
}
