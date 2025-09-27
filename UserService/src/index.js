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

console.log(process.env.PORT);

const PORT = process.env.PORT || 3003;
const start = async () => {
  try {
    await connectProducer();
    await connectConsumer();

    app.listen(PORT, () => console.log(`🚀 UserService rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar serviço:", err);
  }
};

start();
