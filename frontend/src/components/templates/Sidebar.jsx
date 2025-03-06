import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Iconos para el botón
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importar useLocation
import { ImExit } from "react-icons/im";
import { FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaHouse } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { Routes } from "react-router-dom"; // Importar Routes

const Sidebar = ({ setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el sidebar
  const navigate = useNavigate(); // Hook para redirigir al login
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para alternar el sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar el token del localStorage antes de mostrar el mensaje
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  
    // Mostrar mensaje de cierre de sesión exitoso
    Swal.fire({
      title: "Cierre de sesión",
      text: "Sesión cerrada exitosamente.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Redirigir al login
      navigate("/login");
    });
  };

  // Función para determinar si la ruta actual está activa
  const isActive = (path) => location.pathname === path;
  return (
    <div className="relative">
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        className="fixed top-2 left-2 z-50 p-2 text-white bg-black rounded-md shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
  
      {/* Sidebar */}
      <div
        className={`fixed mt-[51px] top-0 left-0 z-40 h-full w-64 bg-[#171717] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="p-4 text-lg font-bold border-b border-gray-700 text-center">
          Menú
        </div>
        <ul className="mt-14 text-center space-y-6">
          <li
            className={`px-4 py-2 flex items-center justify-center space-x-2 font-bold rounded-lg transition-colors duration-300 ease-in-out ${
              isActive("/inicio")
                ? "bg-green-600 text-white"
                : "px-4 py-2 hover:bg-blue-600 flex items-center justify-center space-x-2 font-bold cursor-pointer rounded-lg transition-colors duration-300 ease-in-out"
            }`}
          >
            <FaHouse /> <Link to="/inicio">Inicio</Link>
          </li>
  
          <li
            className={`px-4 py-2 flex items-center justify-center space-x-2 font-bold rounded-lg transition-colors duration-300 ease-in-out ${
              isActive("/bodega")
                ? "bg-green-600 text-white"
                : "px-4 py-2 hover:bg-blue-600 flex items-center justify-center space-x-2 font-bold cursor-pointer rounded-lg transition-colors duration-300 ease-in-out"
            }`}
          >
            <FaBoxOpen />
            <Link to="/bodega">Bodega</Link>
          </li>
  
          <li
            className={`px-4 py-2 flex items-center justify-center space-x-2 font-bold rounded-lg transition-colors duration-300 ease-in-out ${
              isActive("/salida")
                ? "bg-green-600 text-white"
                : "px-4 py-2 hover:bg-blue-600 flex items-center justify-center space-x-2 font-bold cursor-pointer rounded-lg transition-colors duration-300 ease-in-out"
            }`}
          >
            <ImExit />
            <Link to="/salida">Salida Elementos</Link>
          </li>
  
          <li
            className={`px-4 py-2 flex items-center justify-center space-x-2 font-bold rounded-lg transition-colors duration-300 ease-in-out ${
              isActive("/encargados")
                ? "bg-green-600 text-white"
                : "px-4 py-2 hover:bg-blue-600 flex items-center justify-center space-x-2 font-bold cursor-pointer rounded-lg transition-colors duration-300 ease-in-out"
            }`}
          >
            <FaUsers />
            <Link to="/encargados">Encargados</Link>
          </li>
  
          {/* Botón de Cerrar Sesión */}
          <li
            className="px-4 py-2 hover:bg-red-600 flex items-center justify-center space-x-2 font-bold cursor-pointer rounded-lg transition-colors duration-300 ease-in-out"
            style={{ marginTop: "86px" }}
            onClick={handleLogout}
          >
            <ImExit /> <span>Cerrar Sesión</span>
          </li>
        </ul>
      </div>
  
      {/* Contenido principal */}
      <div
        className={`md:ml-64 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex flex-col">
          <div className="h-[calc(100%-52px)] mt-[52px]">
            {/* Aquí, el componente Routes se debe renderizar */}
            <Routes />
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Sidebar;
