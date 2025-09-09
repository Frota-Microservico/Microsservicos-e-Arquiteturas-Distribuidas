import { DevolucaoService } from "../services/devolucao.service.js";

export class DevolucaoController {

    async realizaDevolucao(req, res) {
        try {
            return await DevolucaoService.putDevolucao(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro interno do servidor" });
        }
    }

    async listarDevolucao(req, res) {
        try {

            const devolucoes = await DevolucaoService.getListarDevolucao();
            return res.status(200).json(devolucoes);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar devoluções" });
        }
    }

}