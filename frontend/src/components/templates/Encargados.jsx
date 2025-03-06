import { useEffect, useState } from "react";
import axiosClient from "../moleculas/axiosClient";
import Swal from "sweetalert2";

import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

import { FaUsers } from "react-icons/fa";



function Encargados() {
  const [encargado, setEncargado] = useState([]); // Lista de encargados
  const [filteredEncargados, setFilteredEncargados] = useState([]); // Lista filtrada
  const [searchQuery, setSearchQuery] = useState(""); // Estado de la búsqueda
  const [modalOpen, setModalOpen] = useState(false); // Control del modal
  const [editingEncargado, setEditingEncargado] = useState(null); // Encargado en edición
  const [nombre_encargado, setNombreEncargado] = useState(""); // Nombre del encargado
  const [errors, setErrors] = useState({}); // Errores de validación


  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Número de elementos por página

  // Función para listar los encargados
  const listarEncargados = async () => {
    try {
      const res = await axiosClient.get("encargados/listar");
      if (res.data.length > 0) {
        setEncargado(res.data);
        setFilteredEncargados(res.data); // Inicializar la lista filtrada
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hook useEffect para cargar la lista de encargados
  useEffect(() => {
    listarEncargados();
  }, []);

  // Función para filtrar encargados basado en la búsqueda
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredEncargados(encargado); // Si la búsqueda está vacía, mostrar todos
    } else {
      const filtered = encargado.filter((encargado) =>
        encargado.nombre_encargado.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEncargados(filtered); // Filtrar los encargados
    }

    setCurrentPage(1); // Reiniciar a la primera página
  };

  // Función para realizar la búsqueda al presionar el botón de Buscar
  const handleSearch = () => {
    if (searchQuery === "") {
      setFilteredEncargados(encargado); // Si la búsqueda está vacía, mostrar todos
    } else {
      const filtered = encargado.filter((encargado) =>
        encargado.nombre_encargado.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEncargados(filtered); // Filtrar los encargados
    }
    setCurrentPage(1); // Reiniciar a la primera página
  };

  // Función para registrar un encargado
  const registrarEncargado = async () => {
    try {
      const res = await axiosClient.post("encargados/registrar", {
        nombre_encargado,
      });
      if (res.status === 200) {
        closeModal();
        listarEncargados();
        Swal.fire({
          title: "Encargado registrado",
          text: res.data.message,
          icon: "success",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para actualizar un encargado
  const actualizarEncargado = async () => {
    try {
      const res = await axiosClient.put(
        `/encargados/actualizar/${editingEncargado.id}`,
        { nombre_encargado }
      );
      if (res.status === 200) {
        closeModal();
        listarEncargados();
        Swal.fire({
          title: "Encargado actualizado",
          text: res.data.message,
          icon: "success",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para eliminar un encargado
  const eliminarEncargado = async (id) => {
    try {
      await axiosClient.delete(`/encargados/eliminar/${id}`);
      await listarEncargados(); // Actualiza la lista de encargados
  
      // Verifica si la página actual está vacía
      const updatedFiltered = filteredEncargados.filter((item) => item.id !== id);
      const updatedTotalPages = Math.ceil(updatedFiltered.length / itemsPerPage);
  
      if (currentPage > updatedTotalPages) {
        setCurrentPage(updatedTotalPages > 0 ? updatedTotalPages : 1);
      }
  
      setFilteredEncargados(updatedFiltered); // Actualiza la lista filtrada
  
      Swal.fire({
        title: "Encargado Eliminado",
        text: "El encargado ha sido eliminado correctamente.",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  // Función para limpiar el formulario
  const resetForm = () => {
    setNombreEncargado("");
    setEditingEncargado(null);
    setErrors({});
  };

  // Función para cerrar el modal y limpiar el formulario
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Manejo del formulario (registro o edición)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre_encargado) {
      setErrors({ nombre_encargado: "El nombre es obligatorio" });
      return;
    }
    if (editingEncargado) {
      actualizarEncargado();
    } else {
      registrarEncargado();
    }
  };

  // Función para abrir el modal en modo edición
  const editarEncargado = (encargado) => {
    setEditingEncargado(encargado);
    setNombreEncargado(encargado.nombre_encargado);
    setModalOpen(true);
  };

  // Paginación: Calcular los elementos actuales
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEncargados = filteredEncargados.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Número total de páginas
  const totalPages = Math.ceil(filteredEncargados.length / itemsPerPage);
  return (
    <div className="-mt-7">
      <div className="mx-auto p-6 max-w-[80%] md:max-w-[700px]">
        {/* Botón "Registrar Nuevo Encargado" */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
            >
            <FaUsers className="text-lg" />

           <span>Registrar Nuevo Encargado</span> 
          </button>
        </div>
  
        {/* Barra de búsqueda */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar encargado..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-gray-700 focus:outline-none transition"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200"
          >
            Buscar
          </button>
        </div>
  
        {/* Tabla de encargados */}
        <div className="overflow-hidden rounded-lg shadow-md bg-gray-50">
          <table className="w-full text-sm text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-center">Nombre</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEncargados.length > 0 ? (
                paginatedEncargados.map((encargado) => (
                  <tr
                    key={encargado.id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="px-6 py-4 text-center text-black font-bold">
                      {encargado.nombre_encargado}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => editarEncargado(encargado)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                      >
                        <FaEdit  className="text-lg" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => eliminarEncargado(encargado.id)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                      >
                        <RiDeleteBin6Line className="text-lg" />
                        <span>Eliminar</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No hay encargados registrados.
                  </td>
                </tr>
              )}
            </tbody>  
          </table>
        </div>
  
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-5 py-3 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 transition"
              }`}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow">
              {`${currentPage} de ${totalPages}`}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-5 py-3 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 transition"
              }`}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-[90%] md:max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingEncargado ? "Editar Encargado" : "Registrar Encargado"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="nombre_encargado"
                  className="block font-medium"
                >
                  Nombre del Encargado
                </label>
                <input
                  type="text"
                  id="nombre_encargado"
                  value={nombre_encargado}
                  onChange={(e) => setNombreEncargado(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.nombre_encargado && (
                  <span className="text-red-600">
                    {errors.nombre_encargado}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                >
                  {editingEncargado ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
export default Encargados;
