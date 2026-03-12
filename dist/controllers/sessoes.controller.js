"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sessao_1 = __importDefault(require("../models/Sessao"));
class SessoesController {
    static async findAll(req, res) {
        const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
        if (!hasPagination) {
            const sessoes = await Sessao_1.default.findAll();
            return res.status(200).json(sessoes);
        }
        const page = Math.max(Number(req.query.page || 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
        const offset = (page - 1) * limit;
        const { rows, count } = await Sessao_1.default.findAndCountAll({ limit, offset });
        return res.status(200).json({
            data: rows,
            pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
        });
    }
    static async getById(req, res) {
        const { id } = req.params;
        const sessao = await Sessao_1.default.findByPk(Number(id));
        if (!sessao) {
            return res.status(404).json({ message: "Sessao nao encontrada." });
        }
        return res.status(200).json(sessao);
    }
    static async create(req, res) {
        const { id_filme, id_sala, horario, preco } = req.body;
        const sessao = await Sessao_1.default.create({ id_filme, id_sala, horario, preco });
        return res.status(201).json(sessao);
    }
    static async update(req, res) {
        const { id } = req.params;
        const { id_filme, id_sala, horario, preco } = req.body;
        const sessao = await Sessao_1.default.findByPk(Number(id));
        if (!sessao) {
            return res.status(404).json({ message: "Sessao nao encontrada." });
        }
        await sessao.update({ id_filme, id_sala, horario, preco });
        return res.status(200).json(sessao);
    }
    static async delete(req, res) {
        const { id } = req.params;
        const sessao = await Sessao_1.default.findByPk(Number(id));
        if (!sessao) {
            return res.status(404).json({ message: "Sessao nao encontrada." });
        }
        await sessao.destroy();
        return res.status(200).json({ message: "Sessao removida com sucesso." });
    }
}
exports.default = SessoesController;
