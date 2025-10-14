import { VeiculoModel } from "../../models/veiculo.model.js";
import { connectConsumer } from "../kafka/consumer.js";

export class DevolucaoService {

    static async putDevolucao(req, res) {
        const { idVeiculo } = req.body;

        if (!idVeiculo) {
            return res.status(400).json({ status: 400, detail: "Dados inválidos" });
        }

        const veiculo = await VeiculoModel.findByPk(idVeiculo);

        if (!veiculo) {
            return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
        }

        veiculo.status = "DISPONIVEL";
        await veiculo.save({ usuario: req.user?.id });

        return res.status(202).json({
            status: 202,
            message: "Evento de devolução enviado para processamento",
            veiculoId: idVeiculo
        });
    }

    static async getListarDevolucao(req, res) {
        const devolucoes = await VeiculoModel.findAll();
        return res.status(200).json(devolucoes);
    }

    static async startKafkaConsumer() {
        await connectConsumer();
    }
}
