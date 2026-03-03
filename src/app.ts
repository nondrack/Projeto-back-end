import express, { Router, Response, Request} from "express";


const app = express();
app.use(express.json());

const router: Router = Router();

router.get('/', (req: Request, res: Response) =>{
    res.send("Helo World")
});

app.use(router);

export default app;