import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";
import { VeiculoModel } from "./veiculo.model.js";
import { UserModel } from "./user.model.js";
import { HistoricoModel } from "./historico.model.js"; // ✅ importa o histórico

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

// RELACIONAMENTOS 1:N
VeiculoModel.hasMany(ReservaModel, { foreignKey: "id_veiculo" });
ReservaModel.belongsTo(UserModel, { foreignKey: "id_usuario" });
ReservaModel.belongsTo(VeiculoModel, { foreignKey: "id_veiculo" });

// 🔥 HOOKS PARA HISTÓRICO
ReservaModel.addHook("afterCreate", async (reserva, options) => {
  await HistoricoModel.create({
    tabela: "reservas",
    id_registro: reserva.id,
    acao: "CRIACAO",
    dados_novos: reserva.toJSON(),
    usuario_responsavel: options?.usuario || null,
  });
});

ReservaModel.addHook("afterUpdate", async (reserva, options) => {
  await HistoricoModel.create({
    tabela: "reservas",
    id_registro: reserva.id,
    acao: "ATUALIZACAO",
    dados_anteriores: reserva._previousDataValues, // valores antigos
    dados_novos: reserva.toJSON(), // novos valores
    usuario_responsavel: options?.usuario || null,
  });
});

ReservaModel.addHook("afterDestroy", async (reserva, options) => {
  await HistoricoModel.create({
    tabela: "reservas",
    id_registro: reserva.id,
    acao: "EXCLUSAO",
    dados_anteriores: reserva.toJSON(),
    usuario_responsavel: options?.usuario || null,
  });
});
