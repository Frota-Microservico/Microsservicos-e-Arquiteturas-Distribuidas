import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "reserva-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "reserva-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer conectado ao Kafka");

  // Exemplo: ouvindo evento de pagamento confirmado
  await consumer.subscribe({ topic: "pagamento_confirmado", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const evento = JSON.parse(message.value.toString());
      console.log(`📥 Evento recebido no tópico "${topic}":`, evento);

      if (topic === "pagamento_confirmado") {
        // aqui você poderia atualizar a reserva no banco, por ex:
        // await ReservaModel.update({ status: "CONFIRMADA" }, { where: { id: evento.idReserva } });
      }
    },
  });
};
