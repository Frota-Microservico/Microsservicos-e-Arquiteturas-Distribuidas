import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";
import { HistoricoModel } from "./historico.model.js";

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

VeiculoModel.addHook("afterCreate", async (veiculo, options) => {
    await HistoricoModel.create({
        tabela: "veiculos",
        id_registro: veiculo.id,
        acao: "CRIACAO",
        dados_novos: veiculo.toJSON(),
        usuario_responsavel: options?.usuario || null,
    });
});

VeiculoModel.addHook("afterUpdate", async (veiculo, options) => {
    await HistoricoModel.create({
        tabela: "veiculos",
        id_registro: veiculo.id,
        acao: "ATUALIZACAO",
        dados_anteriores: veiculo._previousDataValues, // valores antigos
        dados_novos: veiculo.toJSON(), // novos valores
        usuario_responsavel: options?.usuario || null,
    });
});

VeiculoModel.addHook("afterDestroy", async (veiculo, options) => {
    await HistoricoModel.create({
        tabela: "veiculos",
        id_registro: veiculo.id,
        acao: "EXCLUSAO",
        dados_anteriores: veiculo.toJSON(),
        usuario_responsavel: options?.usuario || null,
    });
});
