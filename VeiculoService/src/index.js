import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from "../database/config.js";
import { connectProducer } from "./kafka/producer.js";
import { connectConsumer } from "./kafka/consumer.js";

dotenv.config();

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco estabelecida');
        await sequelize.sync({ alter: true });
        console.log('✅ Tabelas sincronizadas');
    } catch (err) {
        console.error('❌ Erro ao conectar no banco:', err);
    }
})();


const start = async () => {
  try {
    await connectProducer();
    await connectConsumer();

    app.listen(process.env.PORT || 3002, () => console.log(`🚀 VeiculoService rodando na porta ${process.env.PORT || 3000}`));
  } catch (err) {
    console.error("Erro ao iniciar serviço:", err);
  }
};

start();