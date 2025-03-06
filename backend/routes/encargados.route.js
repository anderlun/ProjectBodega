import { Router } from "express";
import { listarEncargados, agregarEncargados, eliminarEncargados, actualizarEncargado } from "../controllers/encargados.controller.js";
//OJO Aca los nombres de las importaciones deben ser tal cual a los nombres de las funciones del controlador

const route = Router();

route.post('/registrar',agregarEncargados);
route.get('/listar', listarEncargados);
route.delete('/eliminar/:id', eliminarEncargados);
route.put('/actualizar/:id',actualizarEncargado);

export default route;