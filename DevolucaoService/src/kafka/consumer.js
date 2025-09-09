import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "devolucao-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "devolucao-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer de Devolução conectado ao Kafka");

  await consumer.subscribe({ topic: "devolucao_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const evento = JSON.parse(message.value.toString());
      console.log(`📥 Evento de devolução recebido no tópico "${topic}":`, evento);

      if (topic === "devolucao_topic") {
        // Exemplo: atualizar o status do veículo no banco
        // await VeiculoModel.update(
        //   { status: evento.novoStatus },
        //   { where: { id: evento.idveiculo } }
        // );
      }
    },
  });
};
