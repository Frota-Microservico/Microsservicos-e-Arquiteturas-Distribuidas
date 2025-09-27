import { VeiculoModel } from "../../models/veiculo.model.js";
import { sendEvent } from "../kafka/producer.js";
import { connectConsumer } from "../kafka/consumer.js";


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

        return res.status(201).json(veiculo);
    }

    static async getListarVeiculos() {
        return await VeiculoModel.findAll();
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

        
        // Formatar placa
        const placaFormatada = placa ? placa.replace(/[-\s]/g, '').toUpperCase() : veiculo.placa;

        // Verificar duplicidade de placa em outro veículo
        const placaExistente = await VeiculoModel.findOne({
            where: { placa: placaFormatada, id: { $ne: id } } // Sequelize: id diferente
        });
        if (placaExistente) {
            return res.status(409).json({ status: 409, detail: "Já existe um veículo com esta placa" });
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
        await connectConsumer();
    }
}
