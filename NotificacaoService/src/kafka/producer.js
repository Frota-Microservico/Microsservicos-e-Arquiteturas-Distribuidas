// src/kafka/producer.js
import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "notificacao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
let isConnected = false;

export const connectProducer = async () => {
  if (!isConnected) {
    try {
      await producer.connect();
      isConnected = true;
      console.log("✅ Producer de Notificação conectado ao Kafka");
    } catch (error) {
      console.error("❌ Erro ao conectar o Producer Kafka:", error);
    }
  }
};

export const sendNotificacaoEvent = async (topic, payload) => {
  try {
    if (!isConnected) {
      await connectProducer(); // garante que está conectado antes de enviar
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });

    console.log(`📤 Evento enviado para o tópico "${topic}":`, payload);
  } catch (error) {
    console.error("❌ Erro ao enviar evento Kafka:", error);
  }
};
