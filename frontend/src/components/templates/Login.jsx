import React, { useState } from "react"; // Asegúrate de importar useState
import axiosClient from "../moleculas/axiosClient"; // Importación de axiosClient
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirección
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importación de íconos

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Cambia el estado de visibilidad
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosClient.post("login/login", {
        email,
        contraseña,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);

      Swal.fire({
        title: "¡Éxito!",
        text: "Inicio de sesión exitoso",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/inicio");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al iniciar sesión",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400">
      {/* Fondo decorativo empresarial */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Forma superior izquierda */}
          <path
            d="M0,0 C120,150 280,80 400,180 C520,280 640,120 800,220 L0,220 Z"
            fill="#FE8000"
            opacity="0.8"
          />
          {/* Forma inferior derecha */}
          <path
            d="M1000,800 C920,700 820,850 720,750 C620,650 520,800 420,700 L1000,700 Z"
            fill="#FF6F00"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Contenedor del formulario */}
            {/* Contenedor principal */}
      <div
        className="p-8 rounded-lg shadow-2xl z-10"
        style={{
          background: "linear-gradient(to bottom, #4A90E2, #50E3C2)",
          borderRadius: "1rem",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2 className="text-center text-3xl font-bold mb-4 text-white">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm text-white">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-black shadow-md"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="contraseña"
              className="block mb-2 text-sm text-white"
            >
              Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full p-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-black shadow-md"
              required
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-500 text-xl transform -translate-y-2/4"
              style={{ marginTop: "-24px" }}
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>

          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 rounded-lg font-semibold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            } text-white transition duration-300 ease-in-out shadow-md`}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
