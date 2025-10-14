import { ReservaModel } from "../../models/reserva.model.js";
import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendMessage } from "../kafka/producer.js";
import { Op } from "sequelize";

export class ReservaService {

    static async postReservaVeiculos(req, res) {
        const { idUsuario, idVeiculo, dt_reserva, dt_devolucao } = req.body;

        console.log(req.body);

        if (!idUsuario || !idVeiculo || !dt_reserva || !dt_devolucao) {
            return res.status(400).json({ status: 400, detail: "Dados inválidos" });
        }

        // Verifica se o veículo existe
        const veiculo = await VeiculoModel.findByPk(idVeiculo);
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
                    { dt_reserva: { [Op.between]: [dt_reserva, dt_devolucao] } },
                    { dt_devolucao: { [Op.between]: [dt_reserva, dt_devolucao] } },
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

        const reserva = await ReservaModel.create({
            id_usuario: idUsuario,
            id_veiculo: idVeiculo,
            status: "ATIVA",
            dt_reserva,
            dt_devolucao
        }, { usuario: idUsuario });

        // Envia o evento Kafka para o serviço de veículo
        await sendMessage("reserva_criada", {
            idReserva: reserva.id,
            idUsuario,
            idVeiculo,
            dt_reserva,
            dt_devolucao,
            status: "ATIVA",
        });
        return res.status(201).json(reserva);
    }

    static async getListarReservas(req, res) {
        const reservas = await ReservaModel.findAll({});
        return res.status(200).json(reservas);
    }

    static async getProcuraReservas(req, res) {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, detail: "ID inválido" });
        }

        try {
            const reserva = await ReservaModel.findByPk(id);
            if (!reserva) {
                return res.status(404).json({ status: 404, detail: "Reserva não encontrada" });
            }
            return res.status(200).json(reserva);
        } catch (error) {
            console.error("Erro ao buscar reserva:", error);
            return res.status(500).json({ status: 500, detail: "Erro interno no servidor" });
        }
    }

    static async deleteReserva(req, res) {
        const id = parseInt(req.params.id, 10);
        const { idUsuario } = req.body;

        const reserva = await ReservaModel.findByPk(id);
        if (!reserva) {
            return res.status(404).json({ status: 404, detail: "Reserva não encontrada" });
        }

        await reserva.destroy({ usuario: idUsuario });

        return res.status(200).json({ status: 200, message: "Reserva excluída com sucesso" });
    }

    static async putReserva(req, res) {
        const id = parseInt(req.params.id, 10);
        const { dt_reserva, dt_devolucao, idUsuario } = req.body;

        const reserva = await ReservaModel.findByPk(id);
        if (!reserva) {
            return res.status(404).json({ status: 404, detail: "Reserva não encontrada" });
        }

        await reserva.update(
            { dt_reserva, dt_devolucao },
            { usuario: idUsuario }
        );

        return res.status(200).json(await ReservaModel.findByPk(id));
    }
}
