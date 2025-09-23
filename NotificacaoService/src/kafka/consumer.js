import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { NotificacaoService } from "../services/notificacao.service.js";

dotenv.config();

const kafka = new Kafka({
  clientId: "notificacao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notificacao-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer de Notificação conectado ao Kafka");

  await consumer.subscribe({ topic: "notificacao_topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const evento = JSON.parse(message.value.toString());
        console.log(`📥 Evento recebido no tópico "${topic}":`, evento);

        if (topic === "notificacao_topic") {
          await NotificacaoService.enviarEmail(evento);
        }
      } catch (err) {
        console.error("❌ Erro processando mensagem Kafka:", err);
      }
    },
  });
};
