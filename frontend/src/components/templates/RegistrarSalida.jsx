import { useEffect,useState } from "react";
import axiosClient from "../moleculas/axiosClient";
import { FaBoxOpen } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import Swal from "sweetalert2";
import moment from "moment"

import { GiExitDoor } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";



const RegistrarSalida = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [salidas, setSalidas] = useState([]);
    const [cantidadError, setCantidadError] = useState(""); //cantidad mayor a 0

    const [formData, setFormData] = useState({
      id_bateria: "",
      id_encargado: "",
      id_producto: "" // Añadido campo para el producto
    });
    const [baterias, setBaterias] = useState([]);
    const [encargados, setEncargados] = useState([]);
    const [productos, setProductos] = useState([]); // Estado para productos

      // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Número de elementos por página


  
    useEffect(() => {
      fetchBaterias();
      fetchEncargados();
      fetchSalidas();
      fetchProductos(); // Llamada para obtener productos
    }, []);
  
    // Función para obtener las baterías
    const fetchBaterias = async () => {
      try {
        const response = await axiosClient.get("/bateria/listar");
        setBaterias(response.data);
      } catch (error) {
        console.error("Error al obtener baterías:", error);
      }
    };
  
    // Función para obtener los encargados
    const fetchEncargados = async () => {
      try {
        const response = await axiosClient.get("/encargados/listar");
        setEncargados(response.data);
      } catch (error) {
        console.error("Error al obtener encargados:", error);
      }
    };

      // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const response = await axiosClient.get("/bodega/listar");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

          // Paginación dinámica con botones limitados
          const getPaginationButtons = () => {
            const range = 2; // Número de botones a cada lado de la página actual
            let start = Math.max(currentPage - range, 1); // Asegurarse de no ir por debajo de la página 1
            let end = Math.min(currentPage + range, totalPages); // Asegurarse de no ir más allá de la última página
        
            // Si estamos cerca de los límites, ajustamos el rango
            if (currentPage - range < 1) {
            end = Math.min(start + 4, totalPages); // Para ajustarlo cuando estamos cerca del inicio
            }
            if (currentPage + range > totalPages) {
            start = Math.max(end - 4, 1); // Para ajustarlo cuando estamos cerca del final
            }
        
            const buttons = [];
            for (let i = start; i <= end; i++) {
            buttons.push(i);
            }
            return buttons;
        };
  
    // Función para obtener las salidas
    const fetchSalidas = async () => {
      try {
        const response = await axiosClient.get("/salida/listar");
        setSalidas(response.data);
      } catch (error) {
        console.error("Error al obtener salidas:", error);
      }
    };
  
    // Manejo de los cambios en el formulario
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // Función para cancelar y limpiar el formulario
    const handleCancelar = () => {
        // Limpiar el formulario cuando se cancela
        setFormData({
        id_bateria: "",
        id_encargado: "",
        id_producto: "",
        cantidad: "",
        });
    
        // Cerrar el modal
        setModalOpen(false);
    };
    
  
    // Función para registrar una salida
    const handleRegistrarSalida = async (e) => {
        e.preventDefault();

        // Verificar si la cantidad es 0
        if (formData.cantidad === "" || formData.cantidad <= 0) {
            setCantidadError("La cantidad debe ser mayor a 0");
            return; // No continuar con el envío si la cantidad es inválida
        }
        setCantidadError(""); // Limpiar el error si la cantidad es válida

        try {
          const response = await axiosClient.post("/salida/registrar", formData);
          console.log("Datos de respuesta:", response.data);  // Verifica la estructura de la respuesta
      
          Swal.fire({
            icon: "success",
            title: "Salida registrada",
            text: response.data.message,
          });
      
          // Actualiza las salidas obteniendo los datos más recientes
          fetchSalidas();
        // Limpiar el formulario después de registrar la salida
          setFormData({
                id_bateria: "",
                id_encargado: "",
                id_producto: "",
                cantidad: "", // Limpiar la cantidad también
            });
      
          setModalOpen(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response ? error.response.data.message : "Hubo un error al registrar la salida",
          });
        }
      };
      
    // Función para eliminar una salida
    const handleEliminarSalida = async (id) => {
      try {
        // Realiza la solicitud para eliminar la salida
        const response = await axiosClient.delete(`/salida/eliminar/${id}`);
        
        Swal.fire({
          icon: "success",
          title: "Salida eliminada",
          text: response.data.message,
        });
    
        // Filtra las salidas para eliminar el registro correspondiente
        const updatedSalidas = salidas.filter((salida) => salida.id !== id);
    
        // Actualiza las salidas
        setSalidas(updatedSalidas);
    
        // Recalcula el número total de páginas
        const updatedTotalPages = Math.ceil(updatedSalidas.length / itemsPerPage);
    
        // Si la página actual está vacía después de eliminar, retrocede a la página anterior
        if (currentPage > updatedTotalPages) {
          setCurrentPage(updatedTotalPages > 0 ? updatedTotalPages : 1);
        }
      } catch (error) {
        // Manejo de errores
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al eliminar la salida",
        });
      }
    };
    

     // Cálculos de paginación
        const totalPages = Math.ceil(salidas.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = salidas.slice(indexOfFirstItem, indexOfLastItem);

        const handlePreviousPage = () => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
        };

        const handleNextPage = () => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);

  };
  return (
    <>
        <div className="flex items-center mb-4 gap-4">
          <div
            className="flex items-center bg-black border border-gray-700 rounded-md shadow-md p-2 text-base font-medium text-white"
            style={{ marginLeft: '10px', marginTop: '20px', width: 'fit-content' }}
          >
            <ImExit  className="text-white text-xl mr-2" />
            <h1>SALIDA A BATERIAS</h1>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <button
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-500 transition ml-20"
              onClick={() => setModalOpen(true)}
            >
              <GiExitDoor className="text-lg sm:text-xl lg:text-2xl" />
              <span>Registrar Nueva Salida</span>
            </button>
          </div>
        </div>


      <div className="flex justify-start mt-6 mx-auto w-[900px]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-full">
        <table className="w-full text-sm text-left text-gray-800">
          <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-center">Batería</th>
                <th className="px-6 py-3 text-center">Producto</th>
                <th className="px-6 py-3 text-center">Encargado</th>
                <th className="px-6 py-3 text-center">Cantidad</th>
                <th className="px-6 py-3 text-center">Fecha</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((salida) => (
                <tr key={salida.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-center">{salida.bateria}</td>
                  <td className="px-6 py-4 text-center">{salida.producto}</td>
                  <td className="px-6 py-4 text-center">{salida.encargado}</td>
                  <td className="px-6 py-4 text-center">{salida.cantidad}</td>
                  <td className="px-6 py-4 text-center">
                    {moment(salida.fecha_salida).format('DD-MM-YYYY HH:mm A')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                      onClick={() => handleEliminarSalida(salida.id)}
                    >
                      <RiDeleteBin6Line className="text-lg" />
                      <span>Eliminar</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500 transition"
          }`}
        >
          Anterior
        </button>
        {getPaginationButtons().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-300 hover:bg-gray-400 transition"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500 transition"
          }`}
        >
          Siguiente
        </button>
      </div>
  
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-[400px]">
            <h2 className="text-lg font-bold mb-4">Registrar Salida</h2>
            <form onSubmit={handleRegistrarSalida}>
              <div className="mb-4">
                <label className="block text-gray-700">Batería</label>
                <select
                  name="id_bateria"
                  value={formData.id_bateria}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Seleccione una batería</option>
                  {baterias.map((bateria) => (
                    <option key={bateria.id} value={bateria.id}>
                      {bateria.nombre_bateria}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Producto</label>
                <select
                  name="id_producto"
                  value={formData.id_producto}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre_producto}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mb-4">
                <label className="block text-gray-700">Encargado</label>
                <select
                  name="id_encargado"
                  value={formData.id_encargado}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Seleccione un encargado</option>
                  {encargados.map((encargado) => (
                    <option key={encargado.id} value={encargado.id}>
                      {encargado.nombre_encargado}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mb-4">
                <label className="block text-gray-700">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                {cantidadError && <p className="text-red-500 text-sm">{cantidadError}</p>}
              </div>
  
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
  
};
  
export default RegistrarSalida;