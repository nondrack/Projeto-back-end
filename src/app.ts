import express, { Request, Response, Router } from 'express';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import { requireAdmin, requireAuth } from './middlewares/auth.middleware';
import ClientesController from './controllers/clientes.controller';
import FilmesController from './controllers/filmes.controller';
import SalasController from './controllers/salas.controller';
import AssentosController from './controllers/assentos.controller';
import SessoesController from './controllers/sessoes.controller';
import IngressosController from './controllers/ingressos.controller';
import PagamentosController from './controllers/pagamentos.controller';

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send("Hello World (typescript)");
});

router.post('/auth/login', AuthController.login);

router.get('/users', UsersController.findAll);
router.post('/users', UsersController.create);
router.get('/users/:id', UsersController.getById);
router.put('/users/:id', requireAuth, UsersController.update);

router.get('/usuarios', UsersController.findAll);
router.post('/usuarios', UsersController.create);
router.get('/usuarios/:id', UsersController.getById);
router.put('/usuarios/:id', requireAuth, UsersController.update);

router.get('/clientes', ClientesController.findAll);
router.post('/clientes', ClientesController.create);
router.get('/clientes/:id', ClientesController.getById);

router.get('/filmes', FilmesController.findAll);
router.post('/filmes', requireAuth, requireAdmin, FilmesController.create);
router.get('/filmes/:id', FilmesController.getById);
router.put('/filmes/:id', requireAuth, requireAdmin, FilmesController.update);
router.delete('/filmes/:id', requireAuth, requireAdmin, FilmesController.delete);

router.get('/salas', SalasController.findAll);
router.post('/salas', requireAuth, requireAdmin, SalasController.create);
router.get('/salas/:id', SalasController.getById);
router.put('/salas/:id', requireAuth, requireAdmin, SalasController.update);
router.delete('/salas/:id', requireAuth, requireAdmin, SalasController.delete);

router.get('/assentos', AssentosController.findAll);
router.post('/assentos', AssentosController.create);
router.get('/assentos/:id', AssentosController.getById);

router.get('/sessoes', SessoesController.findAll);
router.post('/sessoes', requireAuth, requireAdmin, SessoesController.create);
router.get('/sessoes/:id', SessoesController.getById);
router.put('/sessoes/:id', requireAuth, requireAdmin, SessoesController.update);
router.delete('/sessoes/:id', requireAuth, requireAdmin, SessoesController.delete);

router.get('/ingressos', IngressosController.findAll);
router.post('/ingressos', IngressosController.create);
router.get('/ingressos/:id', IngressosController.getById);

router.get('/pagamentos', PagamentosController.findAll);
router.post('/pagamentos', PagamentosController.create);
router.get('/pagamentos/:id', PagamentosController.getById);

app.use(router);

export default app;