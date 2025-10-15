import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// 🔹 Configuração Kafka
const kafka = new Kafka({
  clientId: "notificacao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notificacao-group" });

// 🔹 Função principal do consumer
export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer de Notificação conectado ao Kafka");

  await consumer.subscribe({ topic: "notificacao_topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const evento = JSON.parse(message.value.toString());
        console.log(`📥 Evento recebido no tópico "${topic}":`, evento);

        // ===== Envio de e-mail direto via Nodemailer =====
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: evento.to,
          subject: evento.subject,
          text: evento.message,
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Email enviado com sucesso para ${evento.to}`);
      } catch (err) {
        console.error("❌ Erro ao processar ou enviar email:", err);
      }
    },
  });
};
