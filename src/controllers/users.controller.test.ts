import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import UsersController from "./users.controller";
import User from "../models/User";

vi.mock("../models/User", () => ({
  default: {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async () => "hash-senha"),
  },
}));

function createResponse() {
  const res: any = {};
  res.status = vi.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn().mockImplementation((payload: unknown) => {
    res.payload = payload;
    return res;
  });
  return res;
}

describe("UsersController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bloqueia create com cpf invalido", async () => {
    const req: any = {
      body: { nome: "Teste", cpf: "11111111111", email: "teste@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.create(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "CPF invalido." });
  });

  it("permite create valido", async () => {
    const createdUser = {
      get: (field: string) => {
        const payload: Record<string, unknown> = {
          id_usuario: 10,
          nome: "Maria",
          cpf: "52998224725",
          email: "maria@mail.com",
          tipo_usuario: "cliente",
          data_criacao: new Date().toISOString(),
        };
        return payload[field];
      },
    };

    (User.findOne as any).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    (User.create as any).mockResolvedValue(createdUser);

    const req: any = {
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234", tipo_usuario: "cliente" },
    };
    const res = createResponse();

    await UsersController.create(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.payload.email).toBe("maria@mail.com");
  });

  it("bloqueia update quando tenta alterar email", async () => {
    (User.findByPk as any).mockResolvedValue({
      get: (field: string) => (field === "email" ? "atual@mail.com" : ""),
    });

    const req: any = {
      params: { id: "1" },
      authUser: { id_usuario: 1, email: "atual@mail.com", tipo_usuario: "cliente" },
      body: { nome: "Nome", cpf: "52998224725", email: "novo@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.update(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "O email nao pode ser alterado." });
  });
});
