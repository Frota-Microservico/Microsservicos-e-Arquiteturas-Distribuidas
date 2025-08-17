import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "gerenciador_frota", // Nome do banco de dados
    "gerenciador_frota_user", // Nome do usuário
    "root", // Senha
    {
        host: "localhost", // Dentro de um container tem q ser "dcs-postgres"
        dialect: "postgres",
        port: 5433
    }
);
