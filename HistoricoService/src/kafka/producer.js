import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "historico-service",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Producer de Histórico conectado ao Kafka");
};

export const sendHistoricoEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📤 Evento de histórico enviado para "${topic}" ->`, message);
};
