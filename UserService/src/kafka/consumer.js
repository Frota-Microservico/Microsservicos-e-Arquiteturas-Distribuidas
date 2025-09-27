import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "user-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer do UserService conectado ao Kafka");

  // Subscrevendo ao tópico de histórico ou outro tópico relevante
  await consumer.subscribe({ topic: "historico_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const evento = JSON.parse(message.value.toString());
      console.log(`📥 Evento recebido no UserService no tópico "${topic}":`, evento);

      // Aqui você pode:
      // - Atualizar status do usuário
      // - Registrar alguma atividade
      // - Notificar outro serviço, etc.
    },
  });
};
