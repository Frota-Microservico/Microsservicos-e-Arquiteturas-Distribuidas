import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";
import { VeiculoModel } from "./veiculo.model.js";
import { UserModel } from "./user.model.js";

export const ReservaModel = sequelize.define("reserva", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_veiculo: {
    type: DataTypes.INTEGER,
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

// RELACIONAMENTO 1:N
VeiculoModel.hasMany(ReservaModel, { foreignKey: "id_veiculo" });
ReservaModel.belongsTo(UserModel, { foreignKey: "id_usuario" });
ReservaModel.belongsTo(VeiculoModel, { foreignKey: "id_veiculo" });