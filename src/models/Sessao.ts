import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Sessao extends Model {
  public id_sessao!: number;
  public id_filme!: number;
  public id_sala!: number;
  public horario!: Date;
  public preco!: number;
}

Sessao.init(
  {
    id_sessao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_filme: {
      type: DataTypes.INTEGER,
    },
    id_sala: {
      type: DataTypes.INTEGER,
    },
    horario: {
      type: DataTypes.DATE,
    },
    preco: {
      type: DataTypes.DECIMAL(6, 2),
    },
  },
  {
    sequelize,
    tableName: "sessoes",
    timestamps: false,
  },
);

export default Sessao;