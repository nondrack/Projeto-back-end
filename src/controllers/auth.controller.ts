import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/auth";
import { isValidEmail } from "../utils/validators";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedSenha = String(senha || "");

    if (!normalizedEmail || !normalizedSenha) {
      return res.status(400).json({ message: "Email e senha sao obrigatorios." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Email invalido." });
    }

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha invalidos." });
    }

    const senhaHash = String(user.get("senha") || "");
    if (!senhaHash.startsWith("$2")) {
      return res.status(401).json({ message: "Email ou senha invalidos." });
    }

    const senhaValida = await bcrypt.compare(normalizedSenha, senhaHash);

    if (!senhaValida) {
      return res.status(401).json({ message: "Email ou senha invalidos." });
    }

    const payload = {
      id_usuario: Number(user.get("id_usuario")),
      email: String(user.get("email")),
      tipo_usuario: String(user.get("tipo_usuario")),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      token,
      user: {
        id_usuario: Number(user.get("id_usuario")),
        nome: String(user.get("nome") || ""),
        email: String(user.get("email") || ""),
        tipo_usuario: String(user.get("tipo_usuario") || "cliente"),
      },
    });
  }
}

export default AuthController;
