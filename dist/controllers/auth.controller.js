"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../config/auth");
const validators_1 = require("../utils/validators");
class AuthController {
    static async login(req, res) {
        const { email, senha } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedSenha = String(senha || "");
        if (!normalizedEmail || !normalizedSenha) {
            return res.status(400).json({ message: "Email e senha sao obrigatorios." });
        }
        if (!(0, validators_1.isValidEmail)(normalizedEmail)) {
            return res.status(400).json({ message: "Email invalido." });
        }
        const user = await User_1.default.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ message: "Email ou senha invalidos." });
        }
        const senhaHash = String(user.get("senha") || "");
        const senhaValida = senhaHash.startsWith("$2")
            ? await bcryptjs_1.default.compare(normalizedSenha, senhaHash)
            : normalizedSenha === senhaHash;
        if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha invalidos." });
        }
        const payload = {
            id_usuario: Number(user.get("id_usuario")),
            email: String(user.get("email")),
            tipo_usuario: String(user.get("tipo_usuario")),
        };
        const token = jsonwebtoken_1.default.sign(payload, auth_1.JWT_SECRET, { expiresIn: auth_1.JWT_EXPIRES_IN });
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
exports.default = AuthController;
