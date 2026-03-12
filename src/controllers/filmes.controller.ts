import { Request, Response } from "express";
import Filme from "../models/Filme";

class FilmesController {
  static async findAll(req: Request, res: Response) {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;

    if (!hasPagination) {
      const filmes = await Filme.findAll();
      return res.status(200).json(filmes);
    }

    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const { rows, count } = await Filme.findAndCountAll({ limit, offset });

    return res.status(200).json({
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).json({ message: "Filme nao encontrado." });
    }

    return res.status(200).json(filme);
  }

  static async create(req: Request, res: Response) {
    const { titulo, genero, classificacao_etaria, duracao, sinopse, poster_url, data_lancamento } = req.body;

    const filme = await Filme.create({
      titulo,
      genero,
      classificacao_etaria,
      duracao,
      sinopse,
      poster_url,
      data_lancamento,
    });
    res.send(filme);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).send({ message: "Filme nao encontrado." });
    }

    const {
      titulo,
      genero,
      classificacao_etaria,
      duracao,
      sinopse,
      poster_url,
      data_lancamento,
    } = req.body;

    await filme.update({
      titulo,
      genero,
      classificacao_etaria,
      duracao,
      sinopse,
      poster_url,
      data_lancamento,
    });

    return res.send(filme);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const filme = await Filme.findByPk(Number(id));

    if (!filme) {
      return res.status(404).send({ message: "Filme nao encontrado." });
    }

    await filme.destroy();
    return res.send({ message: "Filme removido com sucesso." });
  }
}

export default FilmesController;
