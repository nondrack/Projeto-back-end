import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Filme extends Model {
  public id_filme!: number;
  public titulo!: string;
  public genero!: string;
  public classificacao_etaria!: string;
  public duracao!: number;
  public sinopse!: string;
  public data_lancamento!: Date;
}

Filme.init(
  {
    id_filme: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING,
    },
    classificacao_etaria: {
      type: DataTypes.STRING,
    },
    duracao: {
      type: DataTypes.INTEGER,
    },
    sinopse: {
      type: DataTypes.TEXT,
    },
    data_lancamento: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "filmes",
    timestamps: false,
  },
);

export default Filme;