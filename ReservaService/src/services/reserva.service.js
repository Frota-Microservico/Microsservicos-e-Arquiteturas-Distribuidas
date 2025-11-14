import { ReservaModel } from "../../models/reserva.model.js";
import { UserModel } from "../../models/user.model.js";
import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendMessage, sendNotificacaoEvent } from "../kafka/producer.js";
import { Op } from "sequelize";

function formatarData(data) {
  const dt = new Date(data);
  return dt.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export class ReservaService {

    static async postReservaVeiculos(req) {
        const { idUsuario, idVeiculo, dt_reserva, dt_devolucao } = req.body;

        if (!idUsuario || !idVeiculo || !dt_reserva || !dt_devolucao) {
            throw new Error("Dados inválidos");
        }

        const veiculo = await VeiculoModel.findByPk(idVeiculo);
        if (!veiculo) throw new Error("Veículo não encontrado");

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
                            { dt_devolucao: { [Op.gte]: dt_devolucao } },
                        ],
                    },
                ],
            },
        });

        if (reservasConflitantes) throw new Error("Veículo já reservado neste período");

        const reserva = await ReservaModel.create(
            {
                id_usuario: idUsuario,
                id_veiculo: idVeiculo,
                status: "ATIVA",
                dt_reserva,
                dt_devolucao,
            },
            { usuario: idUsuario }
        );

        await sendMessage("reserva_criada", {
            idReserva: reserva.id,
            idUsuario,
            idVeiculo,
            dt_reserva,
            dt_devolucao,
            status: "ATIVA",
        });

        const user = await UserModel.findByPk(idUsuario);

        const dataReservaFormatada = formatarData(dt_reserva);
        const dataDevolucaoFormatada = formatarData(dt_devolucao);
        const mensagem = `
        <p>Olá, ${user.name}!</p>
        <p>Sua reserva foi criada com sucesso ✅</p>
        <p>
            🚗 <strong>Veículo:</strong> ${veiculo.modelo} (${veiculo.placa})<br>
            📅 <strong>Data da reserva:</strong> ${dataReservaFormatada}<br>
            📆 <strong>Data da devolução:</strong> ${dataDevolucaoFormatada}
        </p>
        <p>Agradecemos por utilizar nosso sistema de reservas.</p>
        `;
        
    // Envia notificação
    await sendNotificacaoEvent("notificacao_topic", {
      to: user.email,
      subject: "Confirmação de Reserva de Veículo",
      message: mensagem.trim(),
      timestamp: new Date(),
    });

        return reserva;
    }
        
    static async getListarReservas() {
        try {
            const reservas = await ReservaModel.findAll({
                include: [
                    { model: UserModel, attributes: ["id", "name", "email"], required: false },
                    { model: VeiculoModel, attributes: ["id", "modelo", "placa"], required: false },
                ],
                order: [["dt_reserva", "DESC"]],
            });

            return reservas.map(r => r.toJSON()); // apenas os dados
        } catch (error) {
            console.error("Erro ao listar reservas:", error);
            throw new Error("Erro ao listar reservas");
        }
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
        const { id } = req.body;

        const reserva = await ReservaModel.findByPk(id);
        if (!reserva) {
            return res.status(404).json({ status: 404, detail: "Reserva não encontrada" });
        }

        await reserva.destroy();

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
