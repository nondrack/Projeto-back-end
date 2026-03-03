import app from "./app";
import { sequelize } from "./models";

const port = 3000;

sequelize.sync({})
app.listen(port,() => {
    console.log(`Servidor esta rodando na porta: ${port}`);
    
})