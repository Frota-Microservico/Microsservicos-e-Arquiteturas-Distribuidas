import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export const Reserva = sequelize.define("Reserva", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_veiculo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("ATIVA", "FINALIZADA"),
    allowNull: false
  },
  dt_reserva: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dt_devolucao: {
    type: DataTypes.DATE,
    allowNull: false
  },
});
