"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ingresso extends sequelize_1.Model {
    id_ingresso;
    id_sessao;
    id_cliente;
    id_assento;
    data_compra;
}
Ingresso.init({
    id_ingresso: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_sessao: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    id_cliente: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    id_assento: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    data_compra: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: "ingressos",
    timestamps: false,
});
exports.default = Ingresso;
