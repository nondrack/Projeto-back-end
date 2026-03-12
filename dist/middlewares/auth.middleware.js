"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
function requireAuth(req, res, next) {
    const request = req;
    const authHeader = String(req.headers.authorization || "");
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token de autenticacao nao informado." });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, auth_1.JWT_SECRET);
        request.authUser = {
            id_usuario: Number(payload.id_usuario),
            email: String(payload.email || ""),
            tipo_usuario: String(payload.tipo_usuario || ""),
        };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token invalido ou expirado." });
    }
}
function requireAdmin(req, res, next) {
    const request = req;
    const role = String(request.authUser?.tipo_usuario || "").toLowerCase();
    if (role !== "admin" && role !== "adm") {
        return res.status(403).json({ message: "Acesso restrito para administradores." });
    }
    return next();
}
