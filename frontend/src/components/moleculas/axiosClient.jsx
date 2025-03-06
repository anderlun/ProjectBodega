import axios from 'axios'; //Importa la librería Axios, que es una herramienta popular en JavaScript para realizar solicitudes HTTP (GET, POST, PUT, DELETE, etc.) a un servidor en pocas palabras lo importamos en las vistas de los templates para que al  momento de que el usu 

// Define la IP base
const baseURL = 'http://localhost:3000'; // Para localmente este //baseURL: Le dice a Axios que todas las solicitudes comenzarán desde esta dirección (ejemplo: http://localhost:3000/).

// const baseURL = 'http://192.168.1.50:3000/'; // En dado caso que sea cambiar de IP (para pruebas en red local)
// Crea una instancia de Axios con la IP base
const axiosClient = axios.create({ //axios.create: Crea una instancia personalizada de Axios que siempre utilizará la misma URL base (baseURL) y configuraciones iniciales. 
    baseURL,
    headers: { 
        'Content-Type': 'application/json', //headers: { 'Content-Type': 'application/json' }: Establece que todas las solicitudes tendrán el encabezado Content-Type configurado como application/json. Esto indica que el formato de los datos enviados/recibidos será JSON osea que sera de tipo numeros y letras, "anderson"  3445, carlos y asi 
    },
});

//EN POCAS PALABRAS SIRVE PARA IMPORTAR AXIOS EN LOS TEMPLATE Y HACER CONEXION CON LA BD


export default axiosClient; //¿Qué hace?: Exporta la instancia de Axios creada para que pueda ser utilizada en cualquier parte del proyecto.
