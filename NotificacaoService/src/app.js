import express from "express";
import dotenv from "dotenv";

import { connectConsumer } from "./kafka/consumer.js";
import { sendEvent } from "./kafka/producer.js";

dotenv.config();

const app = express();
app.use(express.json());

// Exemplo de rota (se quiser, substitua ou adicione as suas)
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// Inicialização do servidor
app.listen(process.env.PORT || 3000, async () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);

  // 🔽 Aqui coloquei o trecho que você queria embutir
  try {
    await connectConsumer();
    console.log("Consumer conectado com sucesso!");

    // Exemplo opcional de evento inicial (caso queira disparar)
    // await sendEvent("meu-topico-test", { msg: "Servidor iniciado" });
  } catch (erro) {
    console.error("Erro ao iniciar o Kafka consumer:", erro);
  }
});
