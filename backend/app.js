import express from "express"; // aqui se importa la dependencia express para utilizarla  
import bodyParser from "body-parser";//aqui se importa bodyParser para utilizarla
import cors from "cors";//aqui se importa la dependencia cors para utilizarla,el cors permite que el backend y el frontend trabajen juntos aunque esten en dominio diferente
import http from "http"; // Importar el módulo http para crear el servidor
import { Server } from "socket.io"; // Importar Socket.IO


// OJO DE LA LINEA 12 HASTA A LINEA 26 ASI DEBE SER EL ORDEN DE ELLAS
// aqui se importan las rutas de la carpeta (routers) del backend las cuales vamos a trabajar el crud  (archivos de  backend/routers  osea los ambiente.route.js , area.route.js todos los que estan alli) Ejemplo :
// import areas from "./routers/area.route.js";
// app.use("/area", areas); // Ruta comentada para futuras implementaciones

//importacion rutas principales
import bodega from  "./routes/bodega.route.js"; // importar rutas el primero se puede poner cualquier nombre, lo demas es la ruta 
import salida from "./routes/salida.route.js"; 
import bateria from "./routes/listbateria.route.js";
import encargados from "./routes/encargados.route.js";
import nombre from "./routes/nombre.route.js";
import usuario  from "./routes/usuario.route.js";
import login from "./routes/login.route.js";

const app = express(); //Es una instancia de Express que representa tu aplicación. Con esta instancia defines rutas, middlewares, y manejas solicitudes/respuestas. Ejemplo app.use("/area", areas);
const port = 3000; //  Especifica el puerto donde el servidor escuchará las solicitudes. En este caso, es el 3000.

// Middleware para analizar solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());// en pocas palabras sirve para que el software reconozca el backend los archivos.json en el requ.body al momento de ejecutar en consola lo que hay muestre informacion sino quedaria como undifed osea indefinido sin el. EN POCAS PALABRAS bodyparser habilita al backend para que entienda archivos JSON enviados en las solicitudes. Transforma el cuerpo (body) de la solicitud en un objeto JavaScript accesible mediante req.body.

app.use(cors()); //el cors permite que el backend y el frontend trabajen juntos aunque esten en dominio diferente


// importar rutas de arriba estas son las del localhost:3000 bodega/registrar ... salida/registrar

app.use("/bodega",bodega); //el primero se pone  cualquier nombre en este caso bodega ***el segundo es el nombre que le pongo al importar lo de arriba osea bodega arriba, osea primero se pone el nombre cualquierae de arriba y se mete ahi dentro la ruta a lo que estoy llamando
app.use("/salida",salida);
app.use("/bateria",bateria);
app.use("/encargados",encargados); 
app.use("/nombre",nombre);
app.use("/usuario", usuario);
app.use("/login",login);
 

// Crear el servidor HTTP y pasar la instancia de Express a él
const server = http.createServer(app);

// Configuración de Socket.IO sobre el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*",  // Permitir conexiones desde cualquier origen (ajustar según necesidades)
  },
});

// Manejar la conexión de clientes con Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Puedes agregar otros eventos aquí para comunicarte con el cliente

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

// Comentario para incluir rutas futuras
// import areas from "./routers/area.route.js";
// app.use("/area", areas); // Ruta comentada para futuras implementaciones

// Iniciar el servidor HTTP en lugar de solo Express
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

export { io };