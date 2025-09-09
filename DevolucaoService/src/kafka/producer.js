import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "devolucao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Producer de Devolução conectado ao Kafka");
};

export const sendDevolucaoEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📤 Evento de devolução enviado para "${topic}" ->`, message);
};
