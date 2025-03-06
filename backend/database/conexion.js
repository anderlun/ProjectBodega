// backend/database/conexion.js   nota con este debo importarlo en los controladores para que funcione 
//por eso mas adelante se veran en los controladores

import dotenv from 'dotenv';// importacion del dotenv para que reconozca archivo .env variable de entorno
import { createPool } from 'mysql2/promise';//se importa el createPool por defecto de la dependencia  esta funcion creara muchas conexiones para el backend y tanto el frontend tengan donde conectarse sin llenarse

dotenv.config();  // Cargar las variables de entorno desde el archivo .env para asi poder usarlas con proccess.env en mi aplicacion, manteniendo el codigo limpio y seguro.

export const pool = createPool({ // se crea la constante pool  y se crean nuevos pool en caso que lleguen a estar ocupados ciertas conexiones, este pool  es la que se exportara en los controladores del backend por eso dice export const pool la cual podra ser exportada para otros archivos en este caso los controladores para que puedan hacer la conexion en la BD y puedan operar o enviar informacion al backend. se puede decir que el pool = CreatePool({})  La constante pool actúa como un contenedor donde se guarda el objeto devuelto por createPool osealo que tiene dentro. Ese objeto contiene toda la funcionalidad que necesitas para interactuar con la base de datos (el contenido es lo que esta abajo)

  // esto de abajo es la conexion que se hace con en el .env (variable de entorno) para asi hacer la conexion mas segura  por eso se separa tambien

  host: process.env.DB_HOST,  // Dirección del host de la base de datos , los procces.env del dotenv.config
  port: process.env.DB_PORT,  // Puerto de la base de datos
  user: process.env.DB_USER,  // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario de la base de datos
  database: process.env.DB_DATABASE, // Nombre de la base de datos
});
