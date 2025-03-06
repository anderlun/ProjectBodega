import { Router } from "express";
import {listarUser,registerUser,eliminarUser,buscarUser,actualizarUser} from "../controllers/usuario.controller.js"


const route = Router();

route.post('/registrar',registerUser);
route.get('/listar',listarUser);
route.get('/buscar', buscarUser);
route.delete('/eliminar/:id', eliminarUser);
route.put('/actualizar/:id', actualizarUser);



export default route; 