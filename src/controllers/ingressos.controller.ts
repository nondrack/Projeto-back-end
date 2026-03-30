import { Request, Response } from "express";
import Assento from "../models/Assento";
import Cliente from "../models/Cliente";
import Ingresso from "../models/Ingresso";
import Sessao from "../models/Sessao";

type AuthenticatedRequest = Request & {
  authUser?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
};

class IngressosController {
  static async findAll(req: Request, res: Response) {
    const ingressos = await Ingresso.findAll();

    res.send(ingressos);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const ingresso = await Ingresso.findByPk(Number(id));

    res.send(ingresso);
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    const { id_sessao, id_cliente, id_assento, data_compra } = req.body;
    const emailAutenticado = String(req.authUser?.email || "").trim().toLowerCase();
    const role = String(req.authUser?.tipo_usuario || "").trim().toLowerCase();

    const sessao = await Sessao.findByPk(Number(id_sessao));
    const cliente = await Cliente.findByPk(Number(id_cliente));
    const assento = await Assento.findByPk(Number(id_assento));

    if (!sessao || !cliente || !assento) {
      return res.status(400).json({ message: "Sessao, cliente ou assento invalido." });
    }

    const emailCliente = String(cliente.get("email") || "").trim().toLowerCase();
    if (role !== "admin" && role !== "adm" && emailCliente !== emailAutenticado) {
      return res.status(403).json({ message: "Voce nao pode criar ingressos para outro usuario." });
    }

    const ingresso = await Ingresso.create({
      id_sessao: Number(id_sessao),
      id_cliente: Number(id_cliente),
      id_assento: Number(id_assento),
      data_compra,
    });

    const idIngresso = Number(ingresso.get("id_ingresso"));
    return res.status(201).json({
      id_ingresso: idIngresso,
      id_sessao: Number(ingresso.get("id_sessao")),
      id_cliente: Number(ingresso.get("id_cliente")),
      id_assento: Number(ingresso.get("id_assento")),
      data_compra: ingresso.get("data_compra"),
    });
  }
}

export default IngressosController;