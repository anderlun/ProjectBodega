import { Router } from "express";
import { registrarSalida,listarSalidaBateria,eliminarSalidaBateria } from "../controllers/salidabateria.controller.js"
//OJO Aca los nombres de las importaciones deben ser tal cual a los nombres de las funciones del controlador

const route = Router();

route.post('/registrar', registrarSalida);

route.get('/listar', listarSalidaBateria);
route.delete('/eliminar/:id', eliminarSalidaBateria);

//voy aqui realizar las demas rutas y probar que se salga y merme en bodega, despues probarlo
//y acabar con los otros dos controladores de asociaciob bodega y persona para registrar

export default route; 