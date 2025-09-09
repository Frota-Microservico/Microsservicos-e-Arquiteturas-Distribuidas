import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendDevolucaoEvent } from "../kafka/producer.js";
import { connectConsumer } from "../kafka/consumer.js";

export class DevolucaoService {

    static async putDevolucao(req, res) {
        const { idveiculo } = req.body;

        if (!idveiculo) {
            return res.status(400).json({ status: 400, detail: "Dados inválidos" });
        }

        const veiculo = await VeiculoModel.findByPk(idveiculo);

        if (!veiculo) {
            return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
        }

        await sendDevolucaoEvent("devolucao_topic", {
            idveiculo,
            novoStatus: "Disponível",
            timestamp: new Date()
        });

        return res.status(202).json({
            status: 202,
            message: "Evento de devolução enviado para processamento",
            veiculoId: idveiculo
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
