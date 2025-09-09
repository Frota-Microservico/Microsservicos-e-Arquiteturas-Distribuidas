import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendHistoricoEvent } from "../kafka/producer.js";
import { connectConsumer } from "../kafka/consumer.js";

export class HistoricoService {

    static async getListaHistorico(req, res) {
        const historico = await VeiculoModel.findAll();

        await sendHistoricoEvent("historico_topic", {
            acao: "LISTAGEM",
            quantidade: historico.length,
            timestamp: new Date()
        });

        return historico;
    }

    static async getHistoricoId(req, res) {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, detail: "ID inválido" });
        }

        try {
            const historicoPorId = await VeiculoModel.findByPk(id);

            await sendHistoricoEvent("historico_topic", {
                acao: "CONSULTA_DETALHE",
                id,
                encontrado: historicoPorId ? true : false,
                timestamp: new Date()
            });

            return historicoPorId;
        } catch (error) {
            console.log("Erro ao encontrar o historico");
            return null;
        }
    }

    static async startKafkaConsumer() {
        await connectConsumer();
    }
}
