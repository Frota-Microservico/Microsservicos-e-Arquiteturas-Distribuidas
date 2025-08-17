import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const userController = new UserController();
const router = Router();

router.get("/api/hello-world", userController.helloWorld);

export default router;