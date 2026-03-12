import { describe, expect, it } from "vitest";
import { isStrongPassword, isValidCPF, isValidEmail } from "./validators";

describe("validators", () => {
  it("valida email correto", () => {
    expect(isValidEmail("user@mail.com")).toBe(true);
  });

  it("rejeita email invalido", () => {
    expect(isValidEmail("user@mail")).toBe(false);
  });

  it("valida senha forte", () => {
    expect(isStrongPassword("Abc@1234")).toBe(true);
  });

  it("rejeita senha fraca", () => {
    expect(isStrongPassword("abc123")).toBe(false);
  });

  it("valida CPF correto", () => {
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("rejeita CPF invalido", () => {
    expect(isValidCPF("11111111111")).toBe(false);
  });
});
