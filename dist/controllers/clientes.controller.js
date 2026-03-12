"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cliente_1 = __importDefault(require("../models/Cliente"));
class ClientesController {
    static async findAll(req, res) {
        const clientes = await Cliente_1.default.findAll();
        res.send(clientes);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const cliente = await Cliente_1.default.findByPk(Number(id));
        res.send(cliente);
    }
    static async create(req, res) {
        const { nome, cpf, email, telefone, data_nascimento } = req.body;
        const emailNormalizado = String(email || "").trim().toLowerCase();
        if (!nome || !emailNormalizado) {
            return res.status(400).json({ message: "Nome e email sao obrigatorios." });
        }
        const clienteExistente = await Cliente_1.default.findOne({ where: { email: emailNormalizado } });
        if (clienteExistente) {
            await clienteExistente.update({
                nome,
                telefone: telefone ?? clienteExistente.get("telefone"),
                data_nascimento: data_nascimento ?? clienteExistente.get("data_nascimento"),
            });
            return res.status(200).json(clienteExistente);
        }
        const cliente = await Cliente_1.default.create({
            nome,
            cpf,
            email: emailNormalizado,
            telefone,
            data_nascimento,
        });
        return res.status(201).json(cliente);
    }
}
exports.default = ClientesController;
