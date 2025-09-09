import { HistoricoService } from "../services/historico.service.js";

export class HistoricoController {

    async listarHistorico(req, res) {
        try {
            const historico = await HistoricoService.getListaHistorico()
            return res.status(200).json(historico);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro interno do servidor" });
        }
    }

    async pesquisaHistorico(req, res) {
        try {

            const historicoId = await HistoricoService.getHistoricoId();
            return res.status(200).json(historicoId);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar historico" });
        }
    }

}