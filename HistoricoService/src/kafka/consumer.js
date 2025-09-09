import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "historico-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "historico-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer de Histórico conectado ao Kafka");

  await consumer.subscribe({ topic: "historico_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const evento = JSON.parse(message.value.toString());
      console.log(`📥 Evento recebido no tópico "${topic}":`, evento);

      if (topic === "historico_topic") {
        // Aqui você poderia, por exemplo:
        // - Salvar logs de auditoria
        // - Atualizar métricas em outro banco
        // - Notificar outro serviço
      }
    },
  });
};
