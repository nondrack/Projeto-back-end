import { Request, Response } from "express";
import User from "../models/User";

class UsersController {

    static async findAll(req: Request, res: Response) {
        const users = await User.findAll();

        res.send(users);
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const user = await User.findByPk(Number(id));

        res.send(user);
    }

    static async create(req: Request, res: Response) {
        const { nome, email, senha, tipo_usuario } = req.body;

        const user = await User.create({ nome, email, senha, tipo_usuario });
        res.send(user);
    }

}

export default UsersController;