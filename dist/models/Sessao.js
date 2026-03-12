"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Sessao extends sequelize_1.Model {
    id_sessao;
    id_filme;
    id_sala;
    horario;
    preco;
}
Sessao.init({
    id_sessao: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_filme: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    id_sala: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    horario: {
        type: sequelize_1.DataTypes.DATE,
    },
    preco: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
    },
}, {
    sequelize: database_1.default,
    tableName: "sessoes",
    timestamps: false,
});
exports.default = Sessao;
