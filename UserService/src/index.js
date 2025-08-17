import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from "../database/config.js";

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Reserva Service ${PORT}`)
})