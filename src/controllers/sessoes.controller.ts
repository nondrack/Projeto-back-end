import { Request, Response } from "express";
import Sessao from "../models/Sessao";

class SessoesController {
  static async findAll(req: Request, res: Response) {
    const sessoes = await Sessao.findAll();

    res.send(sessoes);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const sessao = await Sessao.findByPk(Number(id));

    res.send(sessao);
  }

  static async create(req: Request, res: Response) {
    const { id_filme, id_sala, horario, preco } = req.body;

    const sessao = await Sessao.create({ id_filme, id_sala, horario, preco });
    res.send(sessao);
  }
}

export default SessoesController;