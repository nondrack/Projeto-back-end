"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validators_1 = require("./validators");
(0, vitest_1.describe)("validators", () => {
    (0, vitest_1.it)("valida email correto", () => {
        (0, vitest_1.expect)((0, validators_1.isValidEmail)("user@mail.com")).toBe(true);
    });
    (0, vitest_1.it)("rejeita email invalido", () => {
        (0, vitest_1.expect)((0, validators_1.isValidEmail)("user@mail")).toBe(false);
    });
    (0, vitest_1.it)("valida senha forte", () => {
        (0, vitest_1.expect)((0, validators_1.isStrongPassword)("Abc@1234")).toBe(true);
    });
    (0, vitest_1.it)("rejeita senha fraca", () => {
        (0, vitest_1.expect)((0, validators_1.isStrongPassword)("abc123")).toBe(false);
    });
    (0, vitest_1.it)("valida CPF correto", () => {
        (0, vitest_1.expect)((0, validators_1.isValidCPF)("52998224725")).toBe(true);
    });
    (0, vitest_1.it)("rejeita CPF invalido", () => {
        (0, vitest_1.expect)((0, validators_1.isValidCPF)("11111111111")).toBe(false);
    });
});
