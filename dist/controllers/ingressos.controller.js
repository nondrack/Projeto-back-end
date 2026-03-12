"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Assento_1 = __importDefault(require("../models/Assento"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const Ingresso_1 = __importDefault(require("../models/Ingresso"));
const Sessao_1 = __importDefault(require("../models/Sessao"));
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
        const sessao = await Sessao_1.default.findByPk(Number(id_sessao));
        const cliente = await Cliente_1.default.findByPk(Number(id_cliente));
        const assento = await Assento_1.default.findByPk(Number(id_assento));
        if (!sessao || !cliente || !assento) {
            return res.status(400).json({ message: "Sessao, cliente ou assento invalido." });
        }
        const ingresso = await Ingresso_1.default.create({
            id_sessao: Number(id_sessao),
            id_cliente: Number(id_cliente),
            id_assento: Number(id_assento),
            data_compra,
        });
        const idIngresso = Number(ingresso.get("id_ingresso"));
        return res.status(201).json({
            id_ingresso: idIngresso,
            id_sessao: Number(ingresso.get("id_sessao")),
            id_cliente: Number(ingresso.get("id_cliente")),
            id_assento: Number(ingresso.get("id_assento")),
            data_compra: ingresso.get("data_compra"),
        });
    }
}
exports.default = IngressosController;
