import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export const VeiculoModel = sequelize.define("veiculo", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placa: {
        type: DataTypes.CHAR(8),
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("DISPONIVEL", "RESERVADO", "INDISPONIVEL", "EM USO"),
        allowNull: false
    }
});
