import { VeiculoModel } from "../../models/veiculo.model.js";
import kafka from "../../config/kafka.js"; 

export class VeiculoService {

    static async createVeiculo(req, res) {
        const { modelo, placa, ano } = req.body;

        if (!modelo || !placa || !ano) {
            return res.status(400).json({ status: 400, detail: "Dados inválidos" });
        }

        const placaFormatada = placa.replace(/[-\s]/g, '').toUpperCase();

        const existingVeiculo = await VeiculoModel.findOne({ where: { placa: placaFormatada } });

        if (existingVeiculo) {
            return res.status(409).json({ status: 409, detail: "Veículo já cadastrado com esta placa" });
        }

        const veiculo = await VeiculoModel.create({
            modelo,
            placa: placaFormatada,
            ano,
            status: "DISPONIVEL"
        });

        return res.status(201).json({ status: 201, veiculo });
    }

    static async getListarVeiculos(req, res) {
        const veiculos = await VeiculoModel.findAll();
        return res.status(200).json(veiculos);
    }

    static async getProcuraVeiculo(req, res) {
        const { id } = req.params;
        const veiculo = await VeiculoModel.findByPk(id);

        if (!veiculo) {
            return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
        }

        return res.status(200).json(veiculo);
    }

    static async updateVeiculo(req, res) {
        const { id } = req.params;
        const { modelo, placa, ano, status } = req.body;

        const veiculo = await VeiculoModel.findByPk(id);

        if (!veiculo) {
            return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
        }

        await veiculo.update({
            modelo: modelo || veiculo.modelo,
            placa: placa ? placa.replace(/[-\s]/g, '').toUpperCase() : veiculo.placa,
            ano: ano || veiculo.ano,
            status: status || veiculo.status
        });

        return res.status(200).json({ status: 200, veiculo });
    }

    static async deletaVeiculo(req, res) {
        const { id } = req.params;
        const veiculo = await VeiculoModel.findByPk(id);

        if (!veiculo) {
            return res.status(404).json({ status: 404, detail: "Veículo não encontrado" });
        }

        await veiculo.destroy();
        return res.status(204).send();
    }

    static async startKafkaConsumer() {
        const consumer = kafka.consumer({ groupId: "veiculo-service" });
        await consumer.connect();

        await consumer.subscribe({ topic: "reserva_criada", fromBeginning: false });
        await consumer.subscribe({ topic: "veiculo_devolvido", fromBeginning: false });

        console.log("🚀 VeiculoService Kafka Consumer iniciado...");

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = JSON.parse(message.value.toString());
                console.log(`📩 Evento recebido no VeiculoService [${topic}]`, value);

                if (topic === "reserva_criada") {
                    const veiculo = await VeiculoModel.findByPk(value.idVeiculo);
                    if (veiculo) {
                        await veiculo.update({ status: "RESERVADO" });
                        console.log(`✅ Veículo ${value.idVeiculo} atualizado para RESERVADO`);
                    }
                }

                if (topic === "veiculo_devolvido") {
                    const veiculo = await VeiculoModel.findByPk(value.idVeiculo);
                    if (veiculo) {
                        await veiculo.update({ status: "DISPONIVEL" });
                        console.log(`✅ Veículo ${value.idVeiculo} atualizado para DISPONIVEL`);
                    }
                }
            }
        });
    }
}
