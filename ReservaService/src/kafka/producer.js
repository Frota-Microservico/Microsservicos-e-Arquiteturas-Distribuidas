import { Kafka } from "kafkajs";
import { recordKafkaMessage } from "../metrics.js";

const kafka = new Kafka({
  clientId: "reserva-service",
  brokers: [process.env.KAFKA_BROKER], // endereço do Kafka
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Producer conectado ao Kafka");
};

export const sendMessage = async (topic, message) => {
  const start = Date.now();
  let status = "success";
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    status = "error";
    console.error(`❌ Erro ao enviar mensagem para tópico "${topic}"`, error);
  } finally {
    const latency = (Date.now() - start) / 1000;
    recordKafkaMessage(topic, "produce", status, "reserva-service", latency);
  }
  console.log(`📤 Evento enviado para tópico "${topic}" ->`, message);
};

export const sendNotificacaoEvent = async (topic, payload) => {
  const start = Date.now();
  let status = "success";
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
    console.log(`📤 Evento enviado para o tópico "${topic}":`, payload);
  } catch (error) {
    status = "error";
    console.error("❌ Erro ao enviar evento Kafka:", error);
  } finally {
    const latency = (Date.now() - start) / 1000;
    recordKafkaMessage(topic, "produce", status, "reserva-service", latency);
  }
};
