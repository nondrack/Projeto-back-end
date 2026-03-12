import { Request, Response } from "express";
import Sala from "../models/Sala";

class SalasController {
  static async findAll(req: Request, res: Response) {
    const salas = await Sala.findAll();

    res.send(salas);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const sala = await Sala.findByPk(Number(id));

    res.send(sala);
  }

  static async create(req: Request, res: Response) {
    const { nome, capacidade } = req.body;

    const sala = await Sala.create({ nome, capacidade });
    res.send(sala);
  }
}

export default SalasController;