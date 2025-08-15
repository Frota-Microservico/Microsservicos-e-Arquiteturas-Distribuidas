import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export const Reserva = sequelize.define("Reserva", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  veiculo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_reserva: {
    type: DataTypes.DATE,
    allowNull: false
  }
});
