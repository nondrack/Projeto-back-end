import { describe, expect, it, vi } from "vitest";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { requireAuth, requireAdmin } from "./auth.middleware";
import { JWT_SECRET } from "../config/auth";

type Req = Partial<Request> & { authUser?: { id_usuario: number; email: string; tipo_usuario: string } };
type Res = Partial<Response> & { statusCode?: number; payload?: unknown };

function createResponse(): Res {
  const res: Res = {};
  res.status = vi.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res as Response;
  });
  res.json = vi.fn().mockImplementation((payload: unknown) => {
    res.payload = payload;
    return res as Response;
  });
  return res;
}

describe("auth middleware", () => {
  it("bloqueia requisicao sem token", () => {
    const req: Req = { headers: {} };
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    requireAuth(req as Request, res as Response, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("aceita token valido e chama next", () => {
    const token = jwt.sign(
      { id_usuario: 1, email: "admin@mail.com", tipo_usuario: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const req: Req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    requireAuth(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.authUser?.id_usuario).toBe(1);
  });

  it("bloqueia acesso admin para role nao admin", () => {
    const req: Req = {
      authUser: { id_usuario: 1, email: "user@mail.com", tipo_usuario: "cliente" },
    };
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    requireAdmin(req as Request, res as Response, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});
