import { Request, Response } from "express";
import Cliente from "../models/Cliente";

class ClientesController {
  static async findAll(req: Request, res: Response) {
    const clientes = await Cliente.findAll();

    res.send(clientes);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(Number(id));

    res.send(cliente);
  }

  static async create(req: Request, res: Response) {
    const { nome, cpf, email, telefone, data_nascimento } = req.body;

    const cliente = await Cliente.create({ nome, cpf, email, telefone, data_nascimento });
    res.send(cliente);
  }
}

export default ClientesController;