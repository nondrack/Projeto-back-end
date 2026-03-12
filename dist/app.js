"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const clientes_controller_1 = __importDefault(require("./controllers/clientes.controller"));
const filmes_controller_1 = __importDefault(require("./controllers/filmes.controller"));
const salas_controller_1 = __importDefault(require("./controllers/salas.controller"));
const assentos_controller_1 = __importDefault(require("./controllers/assentos.controller"));
const sessoes_controller_1 = __importDefault(require("./controllers/sessoes.controller"));
const ingressos_controller_1 = __importDefault(require("./controllers/ingressos.controller"));
const pagamentos_controller_1 = __importDefault(require("./controllers/pagamentos.controller"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express_1.default.json());
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send("Hello World (typescript)");
});
router.post('/auth/login', auth_controller_1.default.login);
router.get('/users', users_controller_1.default.findAll);
router.post('/users', users_controller_1.default.create);
router.get('/users/:id', users_controller_1.default.getById);
router.put('/users/:id', auth_middleware_1.requireAuth, users_controller_1.default.update);
router.get('/usuarios', users_controller_1.default.findAll);
router.post('/usuarios', users_controller_1.default.create);
router.get('/usuarios/:id', users_controller_1.default.getById);
router.put('/usuarios/:id', auth_middleware_1.requireAuth, users_controller_1.default.update);
router.get('/clientes', clientes_controller_1.default.findAll);
router.post('/clientes', clientes_controller_1.default.create);
router.get('/clientes/:id', clientes_controller_1.default.getById);
router.get('/filmes', filmes_controller_1.default.findAll);
router.post('/filmes', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, filmes_controller_1.default.create);
router.get('/filmes/:id', filmes_controller_1.default.getById);
router.put('/filmes/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, filmes_controller_1.default.update);
router.delete('/filmes/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, filmes_controller_1.default.delete);
router.get('/salas', salas_controller_1.default.findAll);
router.post('/salas', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, salas_controller_1.default.create);
router.get('/salas/:id', salas_controller_1.default.getById);
router.put('/salas/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, salas_controller_1.default.update);
router.delete('/salas/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, salas_controller_1.default.delete);
router.get('/assentos', assentos_controller_1.default.findAll);
router.post('/assentos', assentos_controller_1.default.create);
router.get('/assentos/:id', assentos_controller_1.default.getById);
router.get('/sessoes', sessoes_controller_1.default.findAll);
router.post('/sessoes', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, sessoes_controller_1.default.create);
router.get('/sessoes/:id', sessoes_controller_1.default.getById);
router.put('/sessoes/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, sessoes_controller_1.default.update);
router.delete('/sessoes/:id', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, sessoes_controller_1.default.delete);
router.get('/ingressos', ingressos_controller_1.default.findAll);
router.post('/ingressos', ingressos_controller_1.default.create);
router.get('/ingressos/:id', ingressos_controller_1.default.getById);
router.get('/pagamentos', pagamentos_controller_1.default.findAll);
router.post('/pagamentos', pagamentos_controller_1.default.create);
router.get('/pagamentos/:id', pagamentos_controller_1.default.getById);
app.use(router);
exports.default = app;
