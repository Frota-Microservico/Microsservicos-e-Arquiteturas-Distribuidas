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
        await connectProducer();
        await connectConsumer();
    } catch (err) {
        console.error('❌ Erro ao conectar no banco:', err);
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Reserva Service ${PORT}`)
})