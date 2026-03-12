"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Pagamento extends sequelize_1.Model {
}
Pagamento.init({
    id_pagamento: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_ingresso: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    valor: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
    },
    metodo_pagamento: {
        type: sequelize_1.DataTypes.ENUM("cartao", "pix", "dinheiro"),
    },
    data_pagamento: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: "pagamentos",
    timestamps: false,
});
exports.default = Pagamento;
