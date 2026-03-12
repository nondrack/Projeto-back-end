"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Cliente extends sequelize_1.Model {
    id_cliente;
    nome;
    cpf;
    email;
    telefone;
    data_nascimento;
}
Cliente.init({
    id_cliente: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING,
    },
    data_nascimento: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: database_1.default,
    tableName: "clientes",
    timestamps: false,
});
exports.default = Cliente;
