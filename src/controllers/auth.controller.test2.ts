import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthController from "./auth.controller";
import User from "../models/User";

vi.mock("../models/User", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "jwt-token-mock"),
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

describe("AuthController.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 400 para email invalido", async () => {
    const req: any = { body: { email: "invalido", senha: "Abc@1234" } };
    const res = createResponse();

    await AuthController.login(req, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "Email invalido." });
  });

  it("retorna 401 para usuario inexistente", async () => {
    (User.findOne as any).mockResolvedValue(null);
    const req: any = { body: { email: "naoexiste@mail.com", senha: "Abc@1234" } };
    const res = createResponse();

    await AuthController.login(req, res as any);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: "naoexiste@mail.com" } });
    expect(res.statusCode).toBe(401);
    expect(res.payload).toEqual({ message: "Email ou senha invalidos." });
  });

  it("retorna 401 quando senha armazenada nao esta criptografada", async () => {
    const userPlain = {
      get: (field: string) => {
        const data: Record<string, unknown> = {
          id_usuario: 1,
          nome: "Admin",
          email: "admin@cinema.com",
          senha: "123456",
          tipo_usuario: "admin",
        };
        return data[field];
      },
    };

    (User.findOne as any).mockResolvedValue(userPlain);
    const req: any = { body: { email: "admin@cinema.com", senha: "123456" } };
    const res = createResponse();

    await AuthController.login(req, res as any);

    expect(res.statusCode).toBe(401);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("retorna token JWT para credenciais validas", async () => {
    const userHash = {
      get: (field: string) => {
        const data: Record<string, unknown> = {
          id_usuario: 7,
          nome: "Administrador",
          email: "admin@cinema.com",
          senha: "$2b$10$hash.mockado",
          tipo_usuario: "admin",
        };
        return data[field];
      },
    };

    (User.findOne as any).mockResolvedValue(userHash);
    (bcrypt.compare as any).mockResolvedValue(true);

    const req: any = { body: { email: "admin@cinema.com", senha: "123456" } };
    const res = createResponse();

    await AuthController.login(req, res as any);

    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "$2b$10$hash.mockado");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect((res.payload as any).token).toBe("jwt-token-mock");
    expect((res.payload as any).user.email).toBe("admin@cinema.com");
  });
});