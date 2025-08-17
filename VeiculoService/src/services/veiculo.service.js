import { VeiculoModel } from "../../models/veiculo.model.js";

export class VeiculoService {

    static async createVeiculo(req, res) {
        const { modelo, placa, ano } = req.body;

        if (!modelo || !placa || !ano) {
            return res.status(400).json({ status: 400, detail: "Dados inválidos" });
        }
        // Normaliza a placa removendo hífens e espaços, e converte para maiúsculas
        const placaFormatada = placa.replace(/[-\s]/g, '').toUpperCase();

        const existingVeiculo = await VeiculoModel.findOne({ where: { placa: placaFormatada } });

        if (existingVeiculo) {
            return res.status(409).json({ status: 409, detail: "Veículo já cadastrado com esta placa" });
        }

        const veiculo = await VeiculoModel.create({
            modelo: modelo,
            placa: placaFormatada,
            ano: ano,
            status: "DISPONIVEL"
        });

        return res.status(201).json({ status: 201, veiculo: veiculo });
    }

}