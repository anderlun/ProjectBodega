import { Router } from "express";
import {verificarNombreProducto} from "../controllers/nombreproducto.controller.js"
//OJO Aca los nombres de las importaciones deben ser tal cual a los nombres de las funciones del controlador

const route = Router();

route.post('/verificar',verificarNombreProducto); 

export default route;