import { Request, Response } from "express";
import Cliente from "../models/Cliente";

type AuthenticatedRequest = Request & {
  authUser?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
};

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

    const emailNormalizado = String(email || "").trim().toLowerCase();
    if (!nome || !emailNormalizado) {
      return res.status(400).json({ message: "Nome e email sao obrigatorios." });
    }

    const clienteExistente = await Cliente.findOne({ where: { email: emailNormalizado } });
    if (clienteExistente) {
      await clienteExistente.update({
        nome,
        telefone: telefone ?? clienteExistente.get("telefone"),
        data_nascimento: data_nascimento ?? clienteExistente.get("data_nascimento"),
      });
      return res.status(200).json(clienteExistente);
    }

    const cliente = await Cliente.create({
      nome,
      cpf,
      email: emailNormalizado,
      telefone,
      data_nascimento,
    });
    return res.status(201).json(cliente);
  }

  static async getMyProfile(req: AuthenticatedRequest, res: Response) {
    const email = String(req.authUser?.email || "").trim().toLowerCase();
    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ message: "Cliente nao encontrado para o usuario autenticado." });
    }

    return res.status(200).json(cliente);
  }

  static async upsertMyProfile(req: AuthenticatedRequest, res: Response) {
    const email = String(req.authUser?.email || "").trim().toLowerCase();
    const nome = String(req.body?.nome || "").trim();
    const telefone = req.body?.telefone;
    const data_nascimento = req.body?.data_nascimento;

    if (!email || !nome) {
      return res.status(400).json({ message: "Nome e email sao obrigatorios." });
    }

    const clienteExistente = await Cliente.findOne({ where: { email } });
    if (clienteExistente) {
      await clienteExistente.update({
        nome,
        telefone: telefone ?? clienteExistente.get("telefone"),
        data_nascimento: data_nascimento ?? clienteExistente.get("data_nascimento"),
      });
      return res.status(200).json(clienteExistente);
    }

    const cliente = await Cliente.create({
      nome,
      email,
      telefone,
      data_nascimento,
    });
    return res.status(201).json(cliente);
  }
}

export default ClientesController;