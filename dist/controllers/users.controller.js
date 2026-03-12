"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const validators_1 = require("../utils/validators");
class UsersController {
    static async findAll(req, res) {
        const users = await User_1.default.findAll();
        res.send(users);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const user = await User_1.default.findByPk(Number(id));
        res.send(user);
    }
    static async create(req, res) {
        const { nome, cpf, email, senha, tipo_usuario } = req.body;
        const normalizedNome = String(nome || "").trim();
        const normalizedCpf = String(cpf || "").replace(/\D/g, "");
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const plainPassword = String(senha || "");
        if (!normalizedNome || !normalizedCpf || !normalizedEmail || !plainPassword) {
            return res.status(400).json({ message: "Nome, cpf, email e senha sao obrigatorios." });
        }
        if (!(0, validators_1.isValidCPF)(normalizedCpf)) {
            return res.status(400).json({ message: "CPF invalido." });
        }
        if (!(0, validators_1.isValidEmail)(normalizedEmail)) {
            return res.status(400).json({ message: "Email invalido." });
        }
        if (!(0, validators_1.isStrongPassword)(plainPassword)) {
            return res.status(400).json({
                message: "Senha fraca. Use no minimo 8 caracteres com maiuscula, minuscula, numero e simbolo.",
            });
        }
        const emailExists = await User_1.default.findOne({ where: { email: normalizedEmail } });
        if (emailExists) {
            return res.status(409).json({ message: "Este email ja esta cadastrado." });
        }
        const cpfExists = await User_1.default.findOne({ where: { cpf: normalizedCpf } });
        if (cpfExists) {
            return res.status(409).json({ message: "Este CPF ja esta cadastrado." });
        }
        const senhaHash = await bcryptjs_1.default.hash(plainPassword, 10);
        const user = await User_1.default.create({
            nome: normalizedNome,
            cpf: normalizedCpf,
            email: normalizedEmail,
            senha: senhaHash,
            tipo_usuario,
        });
        return res.status(201).json({
            id_usuario: user.get("id_usuario"),
            nome: user.get("nome"),
            cpf: user.get("cpf"),
            email: user.get("email"),
            tipo_usuario: user.get("tipo_usuario"),
            data_criacao: user.get("data_criacao"),
        });
    }
    static async update(req, res) {
        const { id } = req.params;
        const authUserId = Number(req.authUser?.id_usuario || 0);
        const targetId = Number(id || 0);
        if (!authUserId || authUserId !== targetId) {
            return res.status(403).json({ message: "Voce so pode editar seu proprio usuario." });
        }
        const { nome, cpf, email, senha } = req.body;
        const normalizedNome = String(nome || "").trim();
        const normalizedCpf = String(cpf || "").replace(/\D/g, "");
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const plainPassword = String(senha || "");
        if (!normalizedNome || !normalizedCpf || !normalizedEmail || !plainPassword) {
            return res.status(400).json({ message: "Nome, cpf, email e senha sao obrigatorios." });
        }
        if (!(0, validators_1.isValidCPF)(normalizedCpf)) {
            return res.status(400).json({ message: "CPF invalido." });
        }
        if (!(0, validators_1.isValidEmail)(normalizedEmail)) {
            return res.status(400).json({ message: "Email invalido." });
        }
        if (!(0, validators_1.isStrongPassword)(plainPassword)) {
            return res.status(400).json({
                message: "Senha fraca. Use no minimo 8 caracteres com maiuscula, minuscula, numero e simbolo.",
            });
        }
        const user = await User_1.default.findByPk(targetId);
        if (!user) {
            return res.status(404).json({ message: "Usuario nao encontrado." });
        }
        const currentEmail = String(user.get("email") || "").toLowerCase();
        if (normalizedEmail !== currentEmail) {
            return res.status(400).json({ message: "O email nao pode ser alterado." });
        }
        const cpfOwner = await User_1.default.findOne({ where: { cpf: normalizedCpf } });
        if (cpfOwner && Number(cpfOwner.get("id_usuario")) !== targetId) {
            return res.status(409).json({ message: "Este CPF ja esta cadastrado." });
        }
        const senhaHash = await bcryptjs_1.default.hash(plainPassword, 10);
        await user.update({
            nome: normalizedNome,
            cpf: normalizedCpf,
            senha: senhaHash,
        });
        return res.status(200).json({
            id_usuario: user.get("id_usuario"),
            nome: user.get("nome"),
            cpf: user.get("cpf"),
            email: user.get("email"),
            tipo_usuario: user.get("tipo_usuario"),
            data_criacao: user.get("data_criacao"),
        });
    }
}
exports.default = UsersController;
