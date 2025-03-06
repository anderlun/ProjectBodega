import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import Login from "../components/templates/Login";
import Bodega from "../components/templates/Bodega";
import Salida from "../components/templates/RegistrarSalida";
import Encargados from "../components/templates/Encargados";
import Inicio from "../components/templates/Inicio";

// ESTE TEMPLATE DE ACA CON SUS RUTAS NO SE SI LO NECESITE PUES AL BORRARLO NO ME APARECE NADA PERO AL YO 
//ACCCEDER A ProtectedLayout  me esta importando las vistas en cuanto al accesos del login para que apareca
// en pocas palabras quizas quitar este porque esta demas y las rutas que debe mostrar el cual estan siendo
//protegigas es en el proyectedlayout ahi se esta metiendo todo.

//si quiera borra esto y no pasara nada lo unico que se esta manejando para mostrar rutas al iniciar sesion con el login es Protected layout el cual esta las rutas protegida,login.jsx y App.jsx dejarla por si las moscas a futura se desea utilizar 

function routes() {
  return (
    <Routes>
        <Route path="/bodega" element={<Bodega/>} />
        <Route path="/salida" element={<Salida/>} />  {/* esto de primero luego pasar al sidebar  */}
        <Route path="/encargados" element={<Encargados/>} />
        <Route path="/login" element={<Login />} />
        
    </Routes>
  )
}

export default routes