import { ReservaModel } from "../../models/reserva.model.js";

export class ReservaService {
    static async getHelloWorld(req, res) {
        return res.status(200).json({ data: "Hello World" });
    }

    static async postReservaVeiculos(req, res) {
        const { idUsuario, idVeiculo, dt_reserva, dt_devolucao } = req.body;

        const reserva = await ReservaModel.create({
            id_usuario: idUsuario,
            id_veiculo: idVeiculo,
            status: "ATIVA",
            dt_reserva: dt_reserva,
            dt_devolucao: dt_devolucao
        });

        return res.status(201).json({
            status: 201,
            detail: "Reserva criada com sucesso",
            data: reserva
        });
    }
}
