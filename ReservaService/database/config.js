import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "gerenciador_frota",
    "gerenciador_frota_user",
    "root",
    {
        host: "localhost",
        dialect: "postgres",
        port: 5432
    }
);
