import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { isStrongPassword, isValidCPF, isValidEmail } from "../utils/validators";

type AuthenticatedRequest = Request & {
    authUser?: {
        id_usuario: number;
        email: string;
        tipo_usuario: string;
    };
};

class UsersController {

    static async findAll(req: Request, res: Response) {
        const users = await User.findAll();

        res.send(users);
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const user = await User.findByPk(Number(id));

        res.send(user);
    }

    static async create(req: Request, res: Response) {
        const { nome, cpf, email, senha, tipo_usuario } = req.body;

        const normalizedNome = String(nome || "").trim();
        const normalizedCpf = String(cpf || "").replace(/\D/g, "");
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const plainPassword = String(senha || "");

        if (!normalizedNome || !normalizedCpf || !normalizedEmail || !plainPassword) {
            return res.status(400).json({ message: "Nome, cpf, email e senha sao obrigatorios." });
        }

        if (!isValidCPF(normalizedCpf)) {
            return res.status(400).json({ message: "CPF invalido." });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Email invalido." });
        }

        if (!isStrongPassword(plainPassword)) {
            return res.status(400).json({
                message: "Senha fraca. Use no minimo 8 caracteres com maiuscula, minuscula, numero e simbolo.",
            });
        }

        const emailExists = await User.findOne({ where: { email: normalizedEmail } });
        if (emailExists) {
            return res.status(409).json({ message: "Este email ja esta cadastrado." });
        }

        const cpfExists = await User.findOne({ where: { cpf: normalizedCpf } });
        if (cpfExists) {
            return res.status(409).json({ message: "Este CPF ja esta cadastrado." });
        }

        const senhaHash = await bcrypt.hash(plainPassword, 10);

        const user = await User.create({
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

    static async update(req: AuthenticatedRequest, res: Response) {
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

        if (!isValidCPF(normalizedCpf)) {
            return res.status(400).json({ message: "CPF invalido." });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Email invalido." });
        }

        if (!isStrongPassword(plainPassword)) {
            return res.status(400).json({
                message: "Senha fraca. Use no minimo 8 caracteres com maiuscula, minuscula, numero e simbolo.",
            });
        }

        const user = await User.findByPk(targetId);
        if (!user) {
            return res.status(404).json({ message: "Usuario nao encontrado." });
        }

        const currentEmail = String(user.get("email") || "").toLowerCase();
        if (normalizedEmail !== currentEmail) {
            return res.status(400).json({ message: "O email nao pode ser alterado." });
        }

        const cpfOwner = await User.findOne({ where: { cpf: normalizedCpf } });
        if (cpfOwner && Number(cpfOwner.get("id_usuario")) !== targetId) {
            return res.status(409).json({ message: "Este CPF ja esta cadastrado." });
        }

        const senhaHash = await bcrypt.hash(plainPassword, 10);
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

export default UsersController;