

export class ReservaService {
    static async getHelloWorld(req, res){
        return res.status(200).json({data: "Hello World"});
    }

    static async postReservaVeiculos(req, res){
        console.log(req.body);
        const body = req.body;

        console.log(body.name);
        
    }
}
