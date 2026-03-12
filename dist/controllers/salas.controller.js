"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sala_1 = __importDefault(require("../models/Sala"));
class SalasController {
    static async findAll(req, res) {
        const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
        if (!hasPagination) {
            const salas = await Sala_1.default.findAll();
            return res.status(200).json(salas);
        }
        const page = Math.max(Number(req.query.page || 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
        const offset = (page - 1) * limit;
        const { rows, count } = await Sala_1.default.findAndCountAll({ limit, offset });
        return res.status(200).json({
            data: rows,
            pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
        });
    }
    static async getById(req, res) {
        const { id } = req.params;
        const sala = await Sala_1.default.findByPk(Number(id));
        if (!sala) {
            return res.status(404).json({ message: "Sala nao encontrada." });
        }
        return res.status(200).json(sala);
    }
    static async create(req, res) {
        const { nome, capacidade } = req.body;
        const sala = await Sala_1.default.create({ nome, capacidade });
        return res.status(201).json(sala);
    }
    static async update(req, res) {
        const { id } = req.params;
        const { nome, capacidade } = req.body;
        const sala = await Sala_1.default.findByPk(Number(id));
        if (!sala) {
            return res.status(404).json({ message: "Sala nao encontrada." });
        }
        await sala.update({ nome, capacidade });
        return res.status(200).json(sala);
    }
    static async delete(req, res) {
        const { id } = req.params;
        const sala = await Sala_1.default.findByPk(Number(id));
        if (!sala) {
            return res.status(404).json({ message: "Sala nao encontrada." });
        }
        await sala.destroy();
        return res.status(200).json({ message: "Sala removida com sucesso." });
    }
}
exports.default = SalasController;
