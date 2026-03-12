"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Filme extends sequelize_1.Model {
}
Filme.init({
    id_filme: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    genero: {
        type: sequelize_1.DataTypes.STRING,
    },
    classificacao_etaria: {
        type: sequelize_1.DataTypes.STRING,
    },
    duracao: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    sinopse: {
        type: sequelize_1.DataTypes.TEXT,
    },
    poster_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    data_lancamento: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: database_1.default,
    tableName: "filmes",
    timestamps: false,
});
exports.default = Filme;
