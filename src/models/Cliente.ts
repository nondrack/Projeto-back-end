import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Cliente extends Model {
  public id_cliente!: number;
  public nome!: string;
  public cpf!: string;
  public email!: string;
  public telefone!: string;
  public data_nascimento!: Date;
}

Cliente.init(
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    telefone: {
      type: DataTypes.STRING,
    },
    data_nascimento: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "clientes",
    timestamps: false,
  },
);

export default Cliente;