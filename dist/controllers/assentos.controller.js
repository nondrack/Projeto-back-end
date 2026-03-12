"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Assento_1 = __importDefault(require("../models/Assento"));
class AssentosController {
    static async findAll(req, res) {
        const assentos = await Assento_1.default.findAll();
        res.send(assentos);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const assento = await Assento_1.default.findByPk(Number(id));
        res.send(assento);
    }
    static async create(req, res) {
        const { id_sala, numero, fila } = req.body;
        const assento = await Assento_1.default.create({ id_sala, numero, fila });
        res.send(assento);
    }
}
exports.default = AssentosController;
