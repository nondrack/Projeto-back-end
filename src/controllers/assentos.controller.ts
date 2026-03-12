import { Request, Response } from "express";
import Assento from "../models/Assento";

class AssentosController {
  static async findAll(req: Request, res: Response) {
    const assentos = await Assento.findAll();

    res.send(assentos);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const assento = await Assento.findByPk(Number(id));

    res.send(assento);
  }

  static async create(req: Request, res: Response) {
    const { id_sala, numero, fila } = req.body;

    const assento = await Assento.create({ id_sala, numero, fila });
    res.send(assento);
  }
}

export default AssentosController;