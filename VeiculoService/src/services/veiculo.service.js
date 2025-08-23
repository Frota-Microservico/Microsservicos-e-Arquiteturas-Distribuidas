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

    static async getListarVeiculos(req, res) {

        const veiculosAtivos = await VeiculoModel.findAll({});
        return veiculosAtivos;
    }

    static async getProcuraVeiculo(req, res) {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, detail: "ID inválido" });
        }

        try {
            const veiculoPorId = await VeiculoModel.findByPk(id);
            return veiculoPorId;
        } catch (error) {
            console.log("Erro ao encontrar o cadastro do veiculo");
            return null;
        }
    }

    static async deleteVeiculo(id) {
        const verificaVeiculo = await VeiculoModel.findByPk(id);

        if (!verificaVeiculo) {
            return res.status(400).json({ status: 400, detail: "Não foi encontrado o veiculo" });
        }

        await VeiculoModel.destroy({
            where: { id: id }
        });

        return true;
    }

    static async putVeiculo(id, status) {

        await VeiculoModel.update(
            {
                status: status 
            },
            { where: { id: id } }
        );

        return await ReservaModel.findByPk(id);
    }

}