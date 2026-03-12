"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_controller_1 = __importDefault(require("./users.controller"));
const User_1 = __importDefault(require("../models/User"));
vitest_1.vi.mock("../models/User", () => ({
    default: {
        findOne: vitest_1.vi.fn(),
        findByPk: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("bcryptjs", () => ({
    default: {
        hash: vitest_1.vi.fn(async () => "hash-senha"),
    },
}));
function createResponse() {
    const res = {};
    res.status = vitest_1.vi.fn().mockImplementation((code) => {
        res.statusCode = code;
        return res;
    });
    res.json = vitest_1.vi.fn().mockImplementation((payload) => {
        res.payload = payload;
        return res;
    });
    return res;
}
(0, vitest_1.describe)("UsersController", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("bloqueia create com cpf invalido", async () => {
        const req = {
            body: { nome: "Teste", cpf: "11111111111", email: "teste@mail.com", senha: "Abc@1234" },
        };
        const res = createResponse();
        await users_controller_1.default.create(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.payload).toEqual({ message: "CPF invalido." });
    });
    (0, vitest_1.it)("permite create valido", async () => {
        const createdUser = {
            get: (field) => {
                const payload = {
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
        User_1.default.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        User_1.default.create.mockResolvedValue(createdUser);
        const req = {
            body: { nome: "Maria", cpf: "52998224725", email: "maria@mail.com", senha: "Abc@1234", tipo_usuario: "cliente" },
        };
        const res = createResponse();
        await users_controller_1.default.create(req, res);
        (0, vitest_1.expect)(bcryptjs_1.default.hash).toHaveBeenCalled();
        (0, vitest_1.expect)(res.statusCode).toBe(201);
        (0, vitest_1.expect)(res.payload.email).toBe("maria@mail.com");
    });
    (0, vitest_1.it)("bloqueia update quando tenta alterar email", async () => {
        User_1.default.findByPk.mockResolvedValue({
            get: (field) => (field === "email" ? "atual@mail.com" : ""),
        });
        const req = {
            params: { id: "1" },
            authUser: { id_usuario: 1, email: "atual@mail.com", tipo_usuario: "cliente" },
            body: { nome: "Nome", cpf: "52998224725", email: "novo@mail.com", senha: "Abc@1234" },
        };
        const res = createResponse();
        await users_controller_1.default.update(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.payload).toEqual({ message: "O email nao pode ser alterado." });
    });
});
