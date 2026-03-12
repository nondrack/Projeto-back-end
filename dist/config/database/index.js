"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("cinema_simples", "root", "1234", {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql', // ou mysql
    logging: true
});
exports.default = sequelize;
