"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class UsersController {
    static async findAll(req, res) {
        const users = await User_1.default.findAll();
        res.send(users);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const user = await User_1.default.findByPk(Number(id));
        res.send(user);
    }
    static async create(req, res) {
        const { nome, email, senha, tipo_usuario } = req.body;
        const user = await User_1.default.create({ nome, email, senha, tipo_usuario });
        res.send(user);
    }
}
exports.default = UsersController;
