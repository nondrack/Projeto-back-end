"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = require("./auth.middleware");
const auth_1 = require("../config/auth");
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
(0, vitest_1.describe)("auth middleware", () => {
    (0, vitest_1.it)("bloqueia requisicao sem token", () => {
        const req = { headers: {} };
        const res = createResponse();
        const next = vitest_1.vi.fn();
        (0, auth_middleware_1.requireAuth)(req, res, next);
        (0, vitest_1.expect)(res.statusCode).toBe(401);
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("aceita token valido e chama next", () => {
        const token = jsonwebtoken_1.default.sign({ id_usuario: 1, email: "admin@mail.com", tipo_usuario: "admin" }, auth_1.JWT_SECRET, { expiresIn: "1h" });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = createResponse();
        const next = vitest_1.vi.fn();
        (0, auth_middleware_1.requireAuth)(req, res, next);
        (0, vitest_1.expect)(next).toHaveBeenCalled();
        (0, vitest_1.expect)(req.authUser?.id_usuario).toBe(1);
    });
    (0, vitest_1.it)("bloqueia acesso admin para role nao admin", () => {
        const req = {
            authUser: { id_usuario: 1, email: "user@mail.com", tipo_usuario: "cliente" },
        };
        const res = createResponse();
        const next = vitest_1.vi.fn();
        (0, auth_middleware_1.requireAdmin)(req, res, next);
        (0, vitest_1.expect)(res.statusCode).toBe(403);
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
});
