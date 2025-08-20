import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "reserva-service",
  brokers: ["localhost:9092"], // endereço do Kafka
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Producer conectado ao Kafka");
};

export const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📤 Evento enviado para tópico "${topic}" ->`, message);
};
