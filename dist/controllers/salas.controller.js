"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sala_1 = __importDefault(require("../models/Sala"));
class SalasController {
    static async findAll(req, res) {
        const salas = await Sala_1.default.findAll();
        res.send(salas);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const sala = await Sala_1.default.findByPk(Number(id));
        res.send(sala);
    }
    static async create(req, res) {
        const { nome, capacidade } = req.body;
        const sala = await Sala_1.default.create({ nome, capacidade });
        res.send(sala);
    }
}
exports.default = SalasController;
