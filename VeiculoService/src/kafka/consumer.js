import { Kafka } from "kafkajs";
import { VeiculoModel } from "../models/veiculo.model.js";

const kafka = new Kafka({
  clientId: "veiculo-service",
  brokers: ["kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "veiculo-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("📥 Kafka Consumer conectado - VeiculoService");

  // Consumindo eventos de reserva
  await consumer.subscribe({ topic: "reserva_criada", fromBeginning: false });
  await consumer.subscribe({ topic: "veiculo_devolvido", fromBeginning: false });

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

      if (topic === "veiculo_devolvido") {
        await VeiculoModel.update(
          { status: "DISPONIVEL" },
          { where: { id: event.idVeiculo } }
        );
        console.log(`✅ Veículo ${event.idVeiculo} atualizado para DISPONIVEL`);
      }
    }
  });
};
