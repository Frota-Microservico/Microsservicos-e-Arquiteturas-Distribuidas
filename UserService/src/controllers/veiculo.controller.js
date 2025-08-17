import { VeiculoService } from "../services/veiculo.service.js";

export class VeiculoController {
    async helloWorld(req, res) {
        res.json({ message: "Hello World" });
    }

    async createVeiculo(req, res) {
        try {
            return await VeiculoService.createVeiculo(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro interno do servidor" });
        }
    }
}