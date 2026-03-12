"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Filme_1 = __importDefault(require("../models/Filme"));
class FilmesController {
    static async findAll(req, res) {
        const filmes = await Filme_1.default.findAll();
        res.send(filmes);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const filme = await Filme_1.default.findByPk(Number(id));
        res.send(filme);
    }
    static async create(req, res) {
        const { titulo, genero, classificacao_etaria, duracao, sinopse, data_lancamento } = req.body;
        const filme = await Filme_1.default.create({
            titulo,
            genero,
            classificacao_etaria,
            duracao,
            sinopse,
            data_lancamento,
        });
        res.send(filme);
    }
}
exports.default = FilmesController;
