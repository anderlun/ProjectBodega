import React from "react";
import { FaWarehouse, FaBoxOpen, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";

function Inicio() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
          {/* Encabezado */}
          <header className="bg-blue-700 text-white py-4 shadow-md fixed w-full z-10 top-[63px]">
            <div className="container mx-auto flex flex-col px-4">
              {/* Contenedor interno para el texto */}
              <div className="flex flex-col items-start justify-center md:pl-10">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Bienvenidos al Aplicativo Web
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light mt-1">
                  "Proyecto Bodega de Aseo del Terminal"
                </p>
              </div>
            </div>
          </header>
    
          {/* Contenido principal */}
          <main className="flex-grow flex items-center justify-center mt-24">
            <div className="container mx-auto max-w-6xl py-12 px-6">
              {/* Sección de descripción */}
              <section className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-blue-700 mb-4">
                  Acerca del Proyecto
                </h2>
                <p className="text-lg text-black">
                  Una solución diseñada para optimizar la administración de recursos de limpieza en la bodega del terminal de transporte de Pitalito. Con herramientas prácticas y funcionales, gestionamos productos, su distribución y el personal encargado.
                </p>
              </section>
    
              {/* Funcionalidades principales */}
              <section>
                <h2 className="text-3xl font-semibold text-blue-700 mb-8 text-center">
                  Secciones Principales
                </h2>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Gestión de Bodega */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <FaWarehouse className="text-blue-700 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black">Gestión de Bodega</h3>
                    <ul className="mt-4 text-black">
                      <li>• Registro de Productos</li>
                      <li>• Control de Entradas</li>
                      <li>• Búsqueda de Productos</li>
                      <li>• Edición y Eliminación</li>
                    </ul>
                  </div>
    
                  {/* Salida de Elementos */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <GiExitDoor className="text-blue-700 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black">Salida de Elementos</h3>
                    <ul className="mt-4 text-black">
                      <li>• Registro de Nuevas Salidas</li>
                      <li>• Listado de Salidas</li>
                      <li>• Eliminación de Registros</li>
                    </ul>
                  </div>
    
                  {/* Administración de Encargados */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <FaUserCog className="text-blue-700 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black">Administración de Encargados</h3>
                    <ul className="mt-4 text-black">
                      <li>• Agregar Encargados</li>
                      <li>• Edición de Información</li>
                      <li>• Eliminación de Registros</li>
                    </ul>
                  </div>
    
                  {/* Cerrar Sesión */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <FaSignOutAlt className="text-blue-700 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black">Cerrar Sesión</h3>
                    <p className="mt-4 text-black">
                      Sal de forma segura y protege la información del sistema.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>
    
          {/* Pie de página */}
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto max-w-4xl text-center">
              <p className="text-sm">
                © 2025 Proyecto Bodega de Aseo del Terminal. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      );
}

export default Inicio;
