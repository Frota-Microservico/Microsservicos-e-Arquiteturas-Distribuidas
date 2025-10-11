import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // vamos criar

const userController = new UserController();
const router = Router();

// Registro e login
router.post("/api/users/create", userController.register);

router.post("/api/login", userController.login);

// Listagem de usuários – só admins
router.get("/api/users", authMiddleware(true), userController.getAllUsers);

// Atualizar usuário – só admins
router.put("/api/users/:id", authMiddleware(true), userController.updateUser);

// Deletar usuário – só admins
router.delete("/api/users/:id", authMiddleware(true), userController.deleteUser);

export default router;
