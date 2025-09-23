import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "notificacao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Producer de Notificação conectado ao Kafka");
};

export const sendNotificacaoEvent = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
    console.log(`📤 Evento enviado para o tópico "${topic}":`, payload);
  } catch (error) {
    console.error("❌ Erro ao enviar evento Kafka:", error);
  }
};
