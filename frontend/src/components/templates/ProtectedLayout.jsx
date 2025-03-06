import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Bodega from "./Bodega";
import Encargados from "./Encargados";
import RegistrarSalida from "./RegistrarSalida";
import Inicio from "./Inicio";

const ProtectedLayout = ({ setIsAuthenticated, handleLogout }) => {
  return (
    <div className="flex">
      {/* Navbar en la parte superior */}
      <div className="fixed w-full z-50">
        <Navbar handleLogout={handleLogout} />
      </div>
      {/* Sidebar fijo en la izquierda */}
      <Sidebar setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
      {/* Contenido principal */}
      <div className="ml-0 mt-20 w-full">
        <Routes>
          <Route path="/" element={<Bodega />} />
          <Route path="/bodega" element={<Bodega />} />
          <Route path="/encargados" element={<Encargados />} />
          <Route path="/salida" element={<RegistrarSalida />} />
          <Route path="/inicio" element={<Inicio />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProtectedLayout;
