import { Kafka } from "kafkajs";
import { VeiculoModel } from "../../models/veiculo.model.js";
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: "veiculo-service",
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: "veiculo-group" });


export const connectConsumer = async () => {
  await consumer.connect();
  console.log("📥 Kafka Consumer conectado - VeiculoService");

  // Consumindo eventos de reserva
  await consumer.subscribe({ topic: "reserva_criada", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`📩 Evento recebido [${topic}]:`, event);

      if (topic === "reserva_criada") {
        await VeiculoModel.update(
          { status: "RESERVADO" },
          { where: { id: event.idVeiculo } }
        );
        console.log(`✅ Veículo ${event.idVeiculo} atualizado para RESERVADO`);
      }

    }
  });
};
