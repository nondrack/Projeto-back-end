import { describe, expect, it, vi, beforeEach } from "vitest";
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
    sign: vi.fn(() => "fake-jwt-token"),
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

describe("AuthController.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 400 quando email invalido", async () => {
    const req: any = { body: { email: "invalido", senha: "Abc@1234" } };
    const res = createResponse();

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ message: "Email invalido." });
  });

  it("retorna 401 quando usuario nao existe", async () => {
    (User.findOne as any).mockResolvedValue(null);

    const req: any = { body: { email: "user@mail.com", senha: "Abc@1234" } };
    const res = createResponse();

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("retorna token e user quando credenciais estao corretas", async () => {
    const fakeUser = {
      get: (field: string) => {
        const payload: Record<string, unknown> = {
          id_usuario: 1,
          nome: "Admin",
          email: "admin@mail.com",
          senha: "$2b$10$hash.mockado",
          tipo_usuario: "admin",
        };
        return payload[field];
      },
    };

    (User.findOne as any).mockResolvedValue(fakeUser);
    (bcrypt.compare as any).mockResolvedValue(true);

    const req: any = { body: { email: "admin@mail.com", senha: "Abc@1234" } };
    const res = createResponse();

    await AuthController.login(req, res);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.payload.token).toBe("fake-jwt-token");
    expect(res.payload.user.email).toBe("admin@mail.com");
  });
});
