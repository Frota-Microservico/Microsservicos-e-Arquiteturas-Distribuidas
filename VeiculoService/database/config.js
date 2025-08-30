import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || "gerenciador_frota", // Nome do banco de dados
    process.env.DB_USER || "gerenciador_frota_user", // Nome do usuário
    process.env.DB_PASSWORD || "root", // Senha
    {
        host: process.env.DB_HOST || "localhost", // Dentro de um container tem q ser "dcs-postgres"
        dialect: "postgres",
        port: process.env.DB_PORT || 5432
    }
);
