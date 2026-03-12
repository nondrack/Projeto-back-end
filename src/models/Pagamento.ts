import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Pagamento extends Model {
  public id_pagamento!: number;
  public id_ingresso!: number;
  public valor!: number;
  public metodo_pagamento!: "cartao" | "pix" | "dinheiro";
  public data_pagamento!: Date;
}

Pagamento.init(
  {
    id_pagamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_ingresso: {
      type: DataTypes.INTEGER,
    },
    valor: {
      type: DataTypes.DECIMAL(6, 2),
    },
    metodo_pagamento: {
      type: DataTypes.ENUM("cartao", "pix", "dinheiro"),
    },
    data_pagamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "pagamentos",
    timestamps: false,
  },
);

export default Pagamento;