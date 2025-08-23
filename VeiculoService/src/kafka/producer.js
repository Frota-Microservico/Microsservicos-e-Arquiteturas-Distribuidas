import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "veiculo-service",
  brokers: ["kafka:9092"]
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("🚀 Kafka Producer conectado - VeiculoService");
};

export const sendEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📤 Evento enviado para tópico [${topic}]:`, message);
};

export default producer;
