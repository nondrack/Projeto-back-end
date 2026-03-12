"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pagamento_1 = __importDefault(require("../models/Pagamento"));
class PagamentosController {
    static async findAll(req, res) {
        const pagamentos = await Pagamento_1.default.findAll();
        res.send(pagamentos);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const pagamento = await Pagamento_1.default.findByPk(Number(id));
        res.send(pagamento);
    }
    static async create(req, res) {
        const { id_ingresso, valor, metodo_pagamento, data_pagamento } = req.body;
        const pagamento = await Pagamento_1.default.create({ id_ingresso, valor, metodo_pagamento, data_pagamento });
        res.send(pagamento);
    }
}
exports.default = PagamentosController;
