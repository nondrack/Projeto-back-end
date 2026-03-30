import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "net";
import app from "./app";

let server: ReturnType<typeof app.listen>;
let baseUrl = "";

beforeAll(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => {
    server.once("listening", () => resolve());
  });

  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

describe("Rota de edicao de usuario autenticada", () => {
  it("retorna 401 em PUT /users/:id sem token", async () => {
    const response = await fetch(`${baseUrl}/users/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Maria",
        cpf: "52998224725",
        email: "maria@mail.com",
        senha: "Abc@1234",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Token de autenticacao nao informado." });
  });

  it("retorna 401 em PUT /usuarios/:id sem token", async () => {
    const response = await fetch(`${baseUrl}/usuarios/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Maria",
        cpf: "52998224725",
        email: "maria@mail.com",
        senha: "Abc@1234",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Token de autenticacao nao informado." });
  });
});
