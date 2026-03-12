import { Request, Response } from "express";
import Sala from "../models/Sala";

class SalasController {
  static async findAll(req: Request, res: Response) {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;

    if (!hasPagination) {
      const salas = await Sala.findAll();
      return res.status(200).json(salas);
    }

    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const { rows, count } = await Sala.findAndCountAll({ limit, offset });

    return res.status(200).json({
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const sala = await Sala.findByPk(Number(id));

    if (!sala) {
      return res.status(404).json({ message: "Sala nao encontrada." });
    }

    return res.status(200).json(sala);
  }

  static async create(req: Request, res: Response) {
    const { nome, capacidade } = req.body;

    const sala = await Sala.create({ nome, capacidade });
    return res.status(201).json(sala);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, capacidade } = req.body;

    const sala = await Sala.findByPk(Number(id));
    if (!sala) {
      return res.status(404).json({ message: "Sala nao encontrada." });
    }

    await sala.update({ nome, capacidade });
    return res.status(200).json(sala);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    const sala = await Sala.findByPk(Number(id));
    if (!sala) {
      return res.status(404).json({ message: "Sala nao encontrada." });
    }

    await sala.destroy();
    return res.status(200).json({ message: "Sala removida com sucesso." });
  }
}

export default SalasController;