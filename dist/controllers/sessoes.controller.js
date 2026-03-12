"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sessao_1 = __importDefault(require("../models/Sessao"));
class SessoesController {
    static async findAll(req, res) {
        const sessoes = await Sessao_1.default.findAll();
        res.send(sessoes);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const sessao = await Sessao_1.default.findByPk(Number(id));
        res.send(sessao);
    }
    static async create(req, res) {
        const { id_filme, id_sala, horario, preco } = req.body;
        const sessao = await Sessao_1.default.create({ id_filme, id_sala, horario, preco });
        res.send(sessao);
    }
}
exports.default = SessoesController;
