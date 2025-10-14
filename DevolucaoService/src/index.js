import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from "../database/config.js";

dotenv.config();

const start = async () => {
    try {
        app.listen(process.env.PORT || 3006, () => console.log(`🚀 DevolucaoService rodando na porta ${process.env.PORT || 3006}`));
    } catch (err) {
        console.error("Erro ao iniciar serviço:", err);
    }
};

start();

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco estabelecida');
        await sequelize.sync({ alter: true });
        console.log('✅ Tabelas sincronizadas');
        start();
    } catch (err) {
        console.error('❌ Erro ao conectar no banco:', err);
    }
})();