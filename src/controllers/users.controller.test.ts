import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import UsersController from "./users.controller";
import User from "../models/User";

vi.mock("../models/User", () => ({
  default: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async () => "hash-senha-mock"),
  },
}));

type Res = {
  status: (code: number) => Res;
  json: (payload: unknown) => Res;
  statusCode?: number;
  payload?: unknown;
};

function createResponse(): Res {
  const res: Res = {
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    json: (payload: unknown) => {
      res.payload = payload;
      return res;
    },
  };

  res.status = vi.fn(res.status);
  res.json = vi.fn(res.json);
  return res;
}

describe("UsersController.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 400 quando faltam campos obrigatorios", async () => {
    const req: any = { body: { nome: "", cpf: "", email: "", senha: "" } };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "Nome, cpf, email e senha sao obrigatorios." });
  });

  it("retorna 400 para CPF invalido", async () => {
    const req: any = {
      body: { nome: "Maria", cpf: "11111111111", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "CPF invalido." });
  });

  it("retorna 400 para email invalido", async () => {
    const req: any = {
      body: { nome: "Maria", cpf: "52998224725", email: "maria-mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "Email invalido." });
  });

  it("retorna 400 para senha fraca", async () => {
    const req: any = {
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "12345678" },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(400);
    expect((res.payload as any).message).toContain("Senha fraca");
  });

  it("retorna 409 quando email ja existe", async () => {
    (User.findOne as any).mockResolvedValueOnce({ id_usuario: 1 });

    const req: any = {
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(409);
    expect(res.payload).toEqual({ message: "Este email ja esta cadastrado." });
  });

  it("retorna 409 quando CPF ja existe", async () => {
    (User.findOne as any)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id_usuario: 2 });

    const req: any = {
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(res.statusCode).toBe(409);
    expect(res.payload).toEqual({ message: "Este CPF ja esta cadastrado." });
  });

  it("retorna 201 para cadastro valido com senha criptografada", async () => {
    const createdUser = {
      get: (field: string) => {
        const data: Record<string, unknown> = {
          id_usuario: 10,
          nome: "Maria",
          cpf: "52998224725",
          email: "maria@mail.com",
          tipo_usuario: "cliente",
          data_criacao: "2026-03-24T00:00:00.000Z",
        };
        return data[field];
      },
    };

    (User.findOne as any)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    (User.create as any).mockResolvedValue(createdUser);

    const req: any = {
      body: {
        nome: " Maria ",
        cpf: "529.982.247-25",
        email: "Maria@Mail.com ",
        senha: "Abc@1234",
        tipo_usuario: "cliente",
      },
    };
    const res = createResponse();

    await UsersController.create(req, res as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("Abc@1234", 10);
    expect(User.create).toHaveBeenCalledWith({
      nome: "Maria",
      cpf: "52998224725",
      email: "maria@mail.com",
      senha: "hash-senha-mock",
      tipo_usuario: "cliente",
    });
    expect(res.statusCode).toBe(201);
    expect((res.payload as any).email).toBe("maria@mail.com");
  });
});

describe("UsersController.update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 403 quando a requisicao nao esta autenticada", async () => {
    const req: any = {
      params: { id: "10" },
      authUser: undefined,
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(403);
    expect(res.payload).toEqual({ message: "Voce so pode editar seu proprio usuario." });
  });

  it("retorna 403 quando tenta editar outro usuario", async () => {
    const req: any = {
      params: { id: "20" },
      authUser: { id_usuario: 10, email: "usuario@mail.com", tipo_usuario: "cliente" },
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(403);
    expect(res.payload).toEqual({ message: "Voce so pode editar seu proprio usuario." });
  });

  it("retorna 400 quando faltam campos obrigatorios", async () => {
    const req: any = {
      params: { id: "10" },
      authUser: { id_usuario: 10, email: "maria@mail.com", tipo_usuario: "cliente" },
      body: { nome: "", cpf: "", email: "", senha: "" },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "Nome, cpf, email e senha sao obrigatorios." });
  });

  it("retorna 400 para CPF invalido", async () => {
    const req: any = {
      params: { id: "10" },
      authUser: { id_usuario: 10, email: "maria@mail.com", tipo_usuario: "cliente" },
      body: { nome: "Maria", cpf: "11111111111", email: "maria@mail.com", senha: "Abc@1234" },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "CPF invalido." });
  });

  it("retorna 400 para senha fraca", async () => {
    const req: any = {
      params: { id: "10" },
      authUser: { id_usuario: 10, email: "maria@mail.com", tipo_usuario: "cliente" },
      body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "12345678" },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(400);
    expect((res.payload as any).message).toContain("Senha fraca");
  });

  it("retorna 400 quando tenta alterar o email", async () => {
    const existingUser = {
      get: (field: string) => {
        const data: Record<string, unknown> = {
          id_usuario: 10,
          email: "email-atual@mail.com",
        };
        return data[field];
      },
    };
    (User.findByPk as any).mockResolvedValue(existingUser);

    const req: any = {
      params: { id: "10" },
      authUser: { id_usuario: 10, email: "email-atual@mail.com", tipo_usuario: "cliente" },
      body: {
        nome: "Maria",
        cpf: "52998224725",
        email: "novo-email@mail.com",
        senha: "Abc@1234",
      },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "O email nao pode ser alterado." });
  });

  it("retorna 200 quando atualiza o proprio usuario com dados validos", async () => {
    const userRecord = {
      get: (field: string) => {
        const data: Record<string, unknown> = {
          id_usuario: 10,
          nome: "Maria",
          cpf: "52998224725",
          email: "maria@mail.com",
          tipo_usuario: "cliente",
          data_criacao: "2026-03-24T00:00:00.000Z",
        };
        return data[field];
      },
      update: vi.fn(async () => undefined),
    };

    (User.findByPk as any).mockResolvedValue(userRecord);
    (User.findOne as any).mockResolvedValue(userRecord);

    const req: any = {
      params: { id: "10" },
      authUser: { id_usuario: 10, email: "maria@mail.com", tipo_usuario: "cliente" },
      body: {
        nome: " Maria ",
        cpf: "529.982.247-25",
        email: "maria@mail.com",
        senha: "Abc@1234",
      },
    };
    const res = createResponse();

    await UsersController.update(req, res as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("Abc@1234", 10);
    expect(userRecord.update).toHaveBeenCalledWith({
      nome: "Maria",
      cpf: "52998224725",
      senha: "hash-senha-mock",
    });
    expect(res.statusCode).toBe(200);
    expect((res.payload as any).email).toBe("maria@mail.com");
  });
});
