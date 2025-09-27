import { UserModel } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class UserService {
  async register({ name, email, pass, isadmin = false }) {
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) throw new Error("Email já registrado");
    const hashedPass = await bcrypt.hash(pass, 10);

    const user = await UserModel.create({ name, email, pass: hashedPass, isadmin });
    return user;
  }

  async login({ email, pass }) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) throw new Error("Senha incorreta");

    const token = jwt.sign(
      { id: user.id, name: user.name, isadmin: user.isadmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email, isadmin: user.isadmin } };
  }

  async getAllUsers() {
    return await UserModel.findAll({ attributes: ["id", "name", "email", "isadmin"] });
  }

  async updateUser(id, { name, email, pass, isadmin }) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuário não encontrado");

    if (pass) {
      const hashedPass = await bcrypt.hash(pass, 10);
      user.pass = hashedPass;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (isadmin !== undefined) user.isadmin = isadmin;

    await user.save();
    return user;
  }

  async deleteUser(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuário não encontrado");
    await user.destroy();
  }
}
