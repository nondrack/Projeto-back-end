import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "cinema_simples",
    "root",
    "1234",
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql', // ou mysql
        logging: true
    }
);

export default sequelize;