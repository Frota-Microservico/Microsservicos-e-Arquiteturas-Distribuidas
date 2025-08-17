import { UserService } from "../services/user.service.js";

export class UserController {
    async helloWorld(req, res) {
        res.json({ message: "Hello World" });
    }

}