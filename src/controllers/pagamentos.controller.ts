import { Request, Response } from "express";
import Cliente from "../models/Cliente";
import Ingresso from "../models/Ingresso";
import Pagamento from "../models/Pagamento";

type AuthenticatedRequest = Request & {
  authUser?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
};

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

  static async create(req: AuthenticatedRequest, res: Response) {
    const { id_ingresso, valor, metodo_pagamento, data_pagamento } = req.body;
    const emailAutenticado = String(req.authUser?.email || "").trim().toLowerCase();
    const role = String(req.authUser?.tipo_usuario || "").trim().toLowerCase();

    const ingresso = await Ingresso.findByPk(Number(id_ingresso));
    if (!ingresso) {
      return res.status(400).json({ message: "Ingresso invalido para pagamento." });
    }

    const cliente = await Cliente.findByPk(Number(ingresso.get("id_cliente")));
    const emailCliente = String(cliente?.get("email") || "").trim().toLowerCase();
    if (role !== "admin" && role !== "adm" && emailCliente !== emailAutenticado) {
      return res.status(403).json({ message: "Voce nao pode registrar pagamento para outro usuario." });
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