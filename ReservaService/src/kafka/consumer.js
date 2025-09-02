import { Kafka } from "kafkajs";
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: "reserva-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "reserva-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer conectado ao Kafka");

  // Exemplo: ouvindo evento de pagamento confirmado
  await consumer.subscribe({ topic: "reservas_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const evento = JSON.parse(message.value.toString());
      console.log(`📥 Evento recebido no tópico "${topic}":`, evento);

      if (topic === "reservas_topic") {
        // aqui você poderia atualizar a reserva no banco, por ex:
        // await ReservaModel.update({ status: "CONFIRMADA" }, { where: { id: evento.idReserva } });
      }
    },
  });
};
