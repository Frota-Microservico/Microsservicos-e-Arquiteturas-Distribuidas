import { ReservaModel } from "../../models/reserva.model.js";

export class ReservaService {
    static async getHelloWorld(req, res) {
        return res.status(200).json({ data: "Hello World" });
    }

    static async postReservaVeiculos(req, res) {
        const body = req.body;
        
        if (body.idUsuario === undefined || body.idVeiculo === undefined) {
            return res.status(400).json({
                status: 400,
                detail: "id_usuario e id_veiculo são obrigatórios"
            });
        }

        const reserva = await ReservaModel.create({
            id_usuario: body.idUsuario,
            id_veiculo: body.idVeiculo,
            status: "ATIVA",
            dt_reserva: body.dt_reserva,
            dt_devolucao: body.dt_devolucao
        });

        console.log(reserva);

        return res.status(201).json({
            status: 201,
            detail: "Reserva criada com sucesso",
            data: reserva
        });
    }
}
