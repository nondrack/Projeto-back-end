import { Request, Response } from "express";
import Filme from "../models/Filme";

class FilmesController {
  static async findAll(req: Request, res: Response) {
    const filmes = await Filme.findAll();

    res.send(filmes);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const filme = await Filme.findByPk(Number(id));

    res.send(filme);
  }

  static async create(req: Request, res: Response) {
    const { titulo, genero, classificacao_etaria, duracao, sinopse, data_lancamento } = req.body;

    const filme = await Filme.create({
      titulo,
      genero,
      classificacao_etaria,
      duracao,
      sinopse,
      data_lancamento,
    });
    res.send(filme);
  }
}

export default FilmesController;
