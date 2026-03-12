import { Request, Response } from "express";
import Ingresso from "../models/Ingresso";
import Pagamento from "../models/Pagamento";

class PagamentosController {
  static async findAll(req: Request, res: Response) {
    const pagamentos = await Pagamento.findAll();

    res.send(pagamentos);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const pagamento = await Pagamento.findByPk(Number(id));

    res.send(pagamento);
  }

  static async create(req: Request, res: Response) {
    const { id_ingresso, valor, metodo_pagamento, data_pagamento } = req.body;

    const ingresso = await Ingresso.findByPk(Number(id_ingresso));
    if (!ingresso) {
      return res.status(400).json({ message: "Ingresso invalido para pagamento." });
    }

    const pagamento = await Pagamento.create({
      id_ingresso: Number(id_ingresso),
      valor,
      metodo_pagamento,
      data_pagamento,
    });
    return res.status(201).json(pagamento);
  }
}

export default PagamentosController;