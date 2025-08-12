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

    async reservar(req, res){
        try {
            await ReservaService.postReservaVeiculos(req, res)
        } catch (error) {
            return res.status(error.status)
                .json({ status: error.status, detail: error.message });
        }
    }
}

