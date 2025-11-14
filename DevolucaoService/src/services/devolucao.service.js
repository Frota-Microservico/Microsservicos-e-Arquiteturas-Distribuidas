import { VeiculoModel } from "../../models/veiculo.model.js";
import { ReservaModel } from "../../models/reserva.model.js";
import { connectConsumer } from "../kafka/consumer.js";

export class DevolucaoService {

    static async putDevolucao(req, res) {
    const { reservaId, veiculoId } = req.body;

    if (!reservaId || !veiculoId) {
        return res.status(400).json({ status: 400, detail: "Dados inválidos" });
    }

    const veiculo = await VeiculoModel.findByPk(veiculoId);
    const reserva = await ReservaModel.findByPk(reservaId);

    if (!veiculo || !reserva) {
        return res.status(404).json({ status: 404, detail: "Veículo ou reserva não encontrada" });
    }

    veiculo.status = "DISPONIVEL";
    await veiculo.save();

    reserva.status = "FINALIZADA";
    reserva.dt_devolucao = new Date();
    await reserva.save();

    return res.status(200).json({ message: "Devolução concluída" });
    }

    static async getListarDevolucao(req, res) {
        const devolucoes = await VeiculoModel.findAll();
        return res.status(200).json(devolucoes);
    }

    static async startKafkaConsumer() {
        await connectConsumer();
    }
}
