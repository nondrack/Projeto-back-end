"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ingresso_1 = __importDefault(require("../models/Ingresso"));
class IngressosController {
    static async findAll(req, res) {
        const ingressos = await Ingresso_1.default.findAll();
        res.send(ingressos);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const ingresso = await Ingresso_1.default.findByPk(Number(id));
        res.send(ingresso);
    }
    static async create(req, res) {
        const { id_sessao, id_cliente, id_assento, data_compra } = req.body;
        const ingresso = await Ingresso_1.default.create({ id_sessao, id_cliente, id_assento, data_compra });
        res.send(ingresso);
    }
}
exports.default = IngressosController;
