import { Router } from "express";
import { listarBaterias } from "../controllers/listarbateria.controller.js";
//OJO Aca los nombres de las importaciones deben ser tal cual a los nombres de las funciones del controlador

const route = Router();

route.get('/listar',listarBaterias);

export default route;