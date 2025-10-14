import { ReservaModel } from "../../models/reserva.model.js";
import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendMessage } from "../kafka/producer.js";
import { Op } from "sequelize";


export class ReservaService {

    static async postReservaVeiculos(req, res) {
        const { idUsuario, idVeiculo, dt_reserva, dt_devolucao } = req.body;

        console.log(req.body);

        // Verifica se o veículo existe
        const veiculo = await VeiculoModel.findOne({
            where: { id: idVeiculo }
        });

        if (!veiculo) {
            return res.status(400).json({
                status: 400,
                detail: "Veículo não encontrado"
            });
        }

        // Verifica se o veículo está disponível no período solicitado
        const reservasConflitantes = await ReservaModel.findOne({
            where: {
                id_veiculo: idVeiculo,
                status: "ATIVA",
                [Op.or]: [
                    {
                        dt_reserva: {
                            [Op.between]: [dt_reserva, dt_devolucao]
                        }
                    },
                    {
                        dt_devolucao: {
                            [Op.between]: [dt_reserva, dt_devolucao]
                        }
                    },
                    {
                        [Op.and]: [
                            { dt_reserva: { [Op.lte]: dt_reserva } },
                            { dt_devolucao: { [Op.gte]: dt_devolucao } }
                        ]
                    }
                ]
            }
        });

        if (reservasConflitantes) {
            return res.status(400).json({
                status: 400,
                detail: "Veículo já reservado neste período"
            });
        }

        // Cria a reserva no banco de dados
        const reserva = await ReservaModel.create({
            id_usuario: idUsuario,
            id_veiculo: idVeiculo,
            status: "ATIVA",
            dt_reserva,
            dt_devolucao
        });

        await sendMessage("reserva_criada", {
            idReserva: reserva.id,
            idUsuario,
            idVeiculo,
            dt_reserva,
            dt_devolucao,
            status: "ATIVA",
        });

        return reserva;
    }

    static async getListarReservas(req, res) {

        const reservasAtivas = await ReservaModel.findAll({});
        return reservasAtivas;
    }

    static async getProcuraReservas(req, res) {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, detail: "ID inválido" });
        }

        try {
            const reservaPorId = await ReservaModel.findByPk(id);
            return reservaPorId;
        } catch (error) {
            console.log("Erro ao encontrar a reserva");
            return null;
        }
    }

    static async deleteReserva(id) {
        const verificaReserva = await ReservaModel.findByPk(id);

        if (!verificaReserva) {
            return res.status(400).json({ status: 400, detail: "Não foi encontrado a reserva" });
        }

        await ReservaModel.destroy({
            where: { id: id }
        });

        return true;
    }

    static async putReserva(id, dt_reserva, dt_devolucao) {

        await ReservaModel.update(
            {
                dt_reserva: dt_reserva,
                dt_devolucao: dt_devolucao
            },
            { where: { id: id } }
        );

        return await ReservaModel.findByPk(id);
    }

}
