import { ReservaService } from "../services/reserva.service.js";


export class ReservaController {
    async helloWorld(req, res) {
        try {
            await ReservaService.getHelloWorld(req, res)
        } catch (error) {
            return res.status(error.status)
                .json({ status: error.status, detail: error.message });
        }
    }

    async reservar(req, res) {
        try {
            const { idUsuario, idVeiculo, dt_reserva, dt_devolucao } = req.body;

            if (!idUsuario || !idVeiculo || !dt_reserva || !dt_devolucao) {
                return res.status(400).json({ status: 400, detail: "Dados inválidos" });
            }
            
            return await ReservaService.postReservaVeiculos(req, res)
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro interno do servidor" });
        }
    }
}

