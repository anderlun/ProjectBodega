import { Router } from "express";
import { listarProductosCompletos,listarProductos,registrarProducto,registrarEntradaStock,actualizarProducto,eliminarProducto,buscarProducto } from "../controllers/bodegaseo.controller.js";
//OJO Aca los nombres de las importaciones deben ser tal cual a los nombres de las funciones del controlador
const route = Router();

route.get('/listar',listarProductosCompletos); 
route.get('/listarp',listarProductos);
route.post('/registrar',registrarProducto);
route.post('/registrare',registrarEntradaStock);
route.put('/actualizar/:id',actualizarProducto);
route.delete('/eliminar/:id',eliminarProducto);
route.get('/buscar/:searchTerm', buscarProducto);



export default route;