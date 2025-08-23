import { ReservaService } from "../services/reserva.service.js";


export class ReservaController {

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

    async listarReserva(req, res) {
        try {

            const reservados = await ReservaService.getListarReservas();
            res.status(200).json(reservados);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar reservas" });
        }
    }

    async procurarReserva(req, res) {
        try {
            const reserva = await ReservaService.getProcuraReservas(req, res);

            if (!reserva) {
                return res.status(400).json({ status: 400, detail: "Não foi encontrado a reserva" });
            }

            res.json(reserva);
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao listar a reserva" });
        }
    }

    async deletaReserva(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            
            if (isNaN(id)) {
                return res.status(400).json({ status: 400, detail: "ID inválido" });
            }

            const verificaDelete = await ReservaService.deleteReserva(id);
            
            if (!verificaDelete) {
                return res.status(400).json({ status: 400, detail: "Não foi encontrado a reserva" });
            }

            return res.status(200).json({
                status: 200,
                detail: "Reserva deletada com sucesso"
            });
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao deletar a reserva" });
        }
    }

    async updateReserva(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { dt_reserva, dt_devolucao } = req.body;
            
            if (isNaN(id)) {
                return res.status(400).json({ status: 400, detail: "ID inválido" });
            }

            if (!dt_reserva || !dt_devolucao) {
                return res.status(400).json({ status: 400, detail: "Dados inválidos" });
            }

            const verificaUpdate = await ReservaService.putReserva(id, dt_reserva, dt_devolucao);

            if (!verificaUpdate) {
                return res.status(404).json({ status: 404, detail: "Reserva não encontrada" });
            }

            return res.status(200).json({
                status: 200,
                detail: "Reserva atualizada com sucesso"
            });
        } catch (error) {
            console.log(error);
            return res.status(500)
                .json({ status: 500, detail: "Erro ao atualizar a reserva" });
        }
    }

}

