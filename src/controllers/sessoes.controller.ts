import { Request, Response } from "express";
import Sessao from "../models/Sessao";

class SessoesController {
  static async findAll(req: Request, res: Response) {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;

    if (!hasPagination) {
      const sessoes = await Sessao.findAll();
      return res.status(200).json(sessoes);
    }

    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const { rows, count } = await Sessao.findAndCountAll({ limit, offset });

    return res.status(200).json({
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const sessao = await Sessao.findByPk(Number(id));

    if (!sessao) {
      return res.status(404).json({ message: "Sessao nao encontrada." });
    }

    return res.status(200).json(sessao);
  }

  static async create(req: Request, res: Response) {
    const { id_filme, id_sala, horario, preco } = req.body;

    const sessao = await Sessao.create({ id_filme, id_sala, horario, preco });
    return res.status(201).json(sessao);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { id_filme, id_sala, horario, preco } = req.body;

    const sessao = await Sessao.findByPk(Number(id));
    if (!sessao) {
      return res.status(404).json({ message: "Sessao nao encontrada." });
    }

    await sessao.update({ id_filme, id_sala, horario, preco });
    return res.status(200).json(sessao);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const sessao = await Sessao.findByPk(Number(id));
    if (!sessao) {
      return res.status(404).json({ message: "Sessao nao encontrada." });
    }

    await sessao.destroy();
    return res.status(200).json({ message: "Sessao removida com sucesso." });
  }
}

export default SessoesController;