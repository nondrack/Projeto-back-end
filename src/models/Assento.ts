import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Assento extends Model {
  public id_assento!: number;
  public id_sala!: number;
  public numero!: string;
  public fila!: string;
}

Assento.init(
  {
    id_assento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_sala: {
      type: DataTypes.INTEGER,
    },
    numero: {
      type: DataTypes.STRING,
    },
    fila: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "assentos",
    timestamps: false,
  },
);

export default Assento;