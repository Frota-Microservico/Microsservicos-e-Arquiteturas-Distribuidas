import { VeiculoService } from "../services/veiculo.service.js";

export class VeiculoController {

    async createVeiculo(req, res) {
        try {
            return await VeiculoService.createVeiculo(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro interno do servidor" });
        }
    }

    async listarVeiculos(req, res) {
        try {

            const veiculos = await VeiculoService.getListarVeiculos();
            return res.status(200).json(veiculos);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar veiculos" });
        }
    }

    async procurarVeiculo(req, res) {
        try {
            const veiculo = await VeiculoService.getProcuraVeiculo(req, res);

            if (!veiculo) {
                return res.status(400).json({ status: 400, detail: "Não foi encontrado o veiculo" });
            }

            return res.json(veiculo);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar o veiculo" });
        }
    }

    async deletaVeiculo(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            
            if (isNaN(id)) {
                return res.status(400).json({ status: 400, detail: "ID inválido" });
            }

            const verificaDelete = await VeiculoService.deleteVeiculo(id);
            
            if (!verificaDelete) {
                return res.status(400).json({ status: 400, detail: "Não foi encontrado o veiculo" });
            }

            return res.status(200).json({
                status: 200,
                detail: "Veiculo deletado com sucesso"
            });
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao deletar o veiculo" });
        }
    }

    async updateVeiculo(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { status } = req.body;
            
            if (isNaN(id)) {
                return res.status(400).json({ status: 400, detail: "ID inválido" });
            }

            if (!status) {
                return res.status(400).json({ status: 400, detail: "Dados inválidos" });
            }

            const verificaUpdate = await ReservaService.updateVeiculo(id, status);

            if (!verificaUpdate) {
                return res.status(404).json({ status: 404, detail: "Veiculo não encontrada" });
            }

            return res.status(200).json({
                status: 200,
                detail: "Veiculo atualizado com sucesso"
            });
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao atualizar o veiculo" });
        }
    }
}