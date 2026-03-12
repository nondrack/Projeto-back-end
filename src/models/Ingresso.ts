import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Ingresso extends Model {
  public id_ingresso!: number;
  public id_sessao!: number;
  public id_cliente!: number;
  public id_assento!: number;
  public data_compra!: Date;
}

Ingresso.init(
  {
    id_ingresso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_sessao: {
      type: DataTypes.INTEGER,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
    },
    id_assento: {
      type: DataTypes.INTEGER,
    },
    data_compra: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "ingressos",
    timestamps: false,
  },
);

export default Ingresso;