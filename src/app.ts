import express, { Request, Response, Router } from 'express';
import UsersController from './controllers/users.controller';
import ClientesController from './controllers/clientes.controller';
import FilmesController from './controllers/filmes.controller';
import SalasController from './controllers/salas.controller';
import AssentosController from './controllers/assentos.controller';
import SessoesController from './controllers/sessoes.controller';
import IngressosController from './controllers/ingressos.controller';
import PagamentosController from './controllers/pagamentos.controller';

const app = express();
app.use(express.json());

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send("Hello World (typescript)");
});

router.get('/users', UsersController.findAll);
router.post('/users', UsersController.create);
router.get('/users/:id', UsersController.getById);

router.get('/usuarios', UsersController.findAll);
router.post('/usuarios', UsersController.create);
router.get('/usuarios/:id', UsersController.getById);

router.get('/clientes', ClientesController.findAll);
router.post('/clientes', ClientesController.create);
router.get('/clientes/:id', ClientesController.getById);

router.get('/filmes', FilmesController.findAll);
router.post('/filmes', FilmesController.create);
router.get('/filmes/:id', FilmesController.getById);

router.get('/salas', SalasController.findAll);
router.post('/salas', SalasController.create);
router.get('/salas/:id', SalasController.getById);

router.get('/assentos', AssentosController.findAll);
router.post('/assentos', AssentosController.create);
router.get('/assentos/:id', AssentosController.getById);

router.get('/sessoes', SessoesController.findAll);
router.post('/sessoes', SessoesController.create);
router.get('/sessoes/:id', SessoesController.getById);

router.get('/ingressos', IngressosController.findAll);
router.post('/ingressos', IngressosController.create);
router.get('/ingressos/:id', IngressosController.getById);

router.get('/pagamentos', PagamentosController.findAll);
router.post('/pagamentos', PagamentosController.create);
router.get('/pagamentos/:id', PagamentosController.getById);

app.use(router);

export default app;