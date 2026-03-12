"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const User_1 = __importDefault(require("../models/User"));
vitest_1.vi.mock("../models/User", () => ({
    default: {
        findOne: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("bcryptjs", () => ({
    default: {
        compare: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vitest_1.vi.fn(() => "fake-jwt-token"),
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
(0, vitest_1.describe)("AuthController.login", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("retorna 400 quando email invalido", async () => {
        const req = { body: { email: "invalido", senha: "Abc@1234" } };
        const res = createResponse();
        await auth_controller_1.default.login(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.payload).toEqual({ message: "Email invalido." });
    });
    (0, vitest_1.it)("retorna 401 quando usuario nao existe", async () => {
        User_1.default.findOne.mockResolvedValue(null);
        const req = { body: { email: "user@mail.com", senha: "Abc@1234" } };
        const res = createResponse();
        await auth_controller_1.default.login(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(401);
    });
    (0, vitest_1.it)("retorna token e user quando credenciais estao corretas", async () => {
        const fakeUser = {
            get: (field) => {
                const payload = {
                    id_usuario: 1,
                    nome: "Admin",
                    email: "admin@mail.com",
                    senha: "$2b$10$hash.mockado",
                    tipo_usuario: "admin",
                };
                return payload[field];
            },
        };
        User_1.default.findOne.mockResolvedValue(fakeUser);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        const req = { body: { email: "admin@mail.com", senha: "Abc@1234" } };
        const res = createResponse();
        await auth_controller_1.default.login(req, res);
        (0, vitest_1.expect)(jsonwebtoken_1.default.sign).toHaveBeenCalled();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.payload.token).toBe("fake-jwt-token");
        (0, vitest_1.expect)(res.payload.user.email).toBe("admin@mail.com");
    });
});
