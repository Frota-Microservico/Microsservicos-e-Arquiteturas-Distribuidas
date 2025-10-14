// src/models/historico.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export const HistoricoModel = sequelize.define("historico", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tabela: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_registro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  acao: {
    type: DataTypes.ENUM("CRIACAO", "ATUALIZACAO", "EXCLUSAO"),
    allowNull: false,
  },
  dados_anteriores: {
    type: DataTypes.JSONB, // guarda objeto JSON
    allowNull: true,
  },
  dados_novos: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  usuario_responsavel: {
    type: DataTypes.STRING, // ou INTEGER se quiser o ID do user
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "historicos",
  timestamps: false,
});
