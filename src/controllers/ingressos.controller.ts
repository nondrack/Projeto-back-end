import { Request, Response } from "express";
import Ingresso from "../models/Ingresso";

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

    const ingresso = await Ingresso.create({ id_sessao, id_cliente, id_assento, data_compra });
    res.send(ingresso);
  }
}

export default IngressosController;