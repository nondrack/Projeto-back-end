"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Filme_1 = __importDefault(require("../models/Filme"));
class FilmesController {
    static async findAll(req, res) {
        const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
        if (!hasPagination) {
            const filmes = await Filme_1.default.findAll();
            return res.status(200).json(filmes);
        }
        const page = Math.max(Number(req.query.page || 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
        const offset = (page - 1) * limit;
        const { rows, count } = await Filme_1.default.findAndCountAll({ limit, offset });
        return res.status(200).json({
            data: rows,
            pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
        });
    }
    static async getById(req, res) {
        const { id } = req.params;
        const filme = await Filme_1.default.findByPk(Number(id));
        if (!filme) {
            return res.status(404).json({ message: "Filme nao encontrado." });
        }
        return res.status(200).json(filme);
    }
    static async create(req, res) {
        const { titulo, genero, classificacao_etaria, duracao, sinopse, poster_url, data_lancamento } = req.body;
        const filme = await Filme_1.default.create({
            titulo,
            genero,
            classificacao_etaria,
            duracao,
            sinopse,
            poster_url,
            data_lancamento,
        });
        res.send(filme);
    }
    static async update(req, res) {
        const { id } = req.params;
        const filme = await Filme_1.default.findByPk(Number(id));
        if (!filme) {
            return res.status(404).send({ message: "Filme nao encontrado." });
        }
        const { titulo, genero, classificacao_etaria, duracao, sinopse, poster_url, data_lancamento, } = req.body;
        await filme.update({
            titulo,
            genero,
            classificacao_etaria,
            duracao,
            sinopse,
            poster_url,
            data_lancamento,
        });
        return res.send(filme);
    }
    static async delete(req, res) {
        const { id } = req.params;
        const filme = await Filme_1.default.findByPk(Number(id));
        if (!filme) {
            return res.status(404).send({ message: "Filme nao encontrado." });
        }
        await filme.destroy();
        return res.send({ message: "Filme removido com sucesso." });
    }
}
exports.default = FilmesController;
