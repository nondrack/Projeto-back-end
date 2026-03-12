import { Request, Response } from "express";
import Assento from "../models/Assento";
import Cliente from "../models/Cliente";
import Ingresso from "../models/Ingresso";
import Sessao from "../models/Sessao";

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

  static async create(req: Request, res: Response) {
    const { id_sessao, id_cliente, id_assento, data_compra } = req.body;

    const sessao = await Sessao.findByPk(Number(id_sessao));
    const cliente = await Cliente.findByPk(Number(id_cliente));
    const assento = await Assento.findByPk(Number(id_assento));

    if (!sessao || !cliente || !assento) {
      return res.status(400).json({ message: "Sessao, cliente ou assento invalido." });
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