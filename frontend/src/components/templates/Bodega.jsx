
import {useEffect,useState} from "react";//useEffect para traer la informacion de la bd ,listarlas
import axiosClient from "../moleculas/axiosClient";
import { FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";

import { MdAddBusiness } from "react-icons/md";//icono de adicionar
import { FaDoorOpen } from "react-icons/fa"; //icono de abrir
import { FcSearch } from "react-icons/fc";//icono de buscar

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";






function Bodega() {
    const [productos, setProductos] = useState([]); 
    const [nombreProducto, setNombreProducto] = useState("");// useState("") crea el cuaderno vacío, setNombreProducto("Manzanas") es el acto de escribir "Manzanas" en el cuaderno.  
    // nombreProducto es lo que tienes al final en el cuaderno, por ejemplo "Manzanas"
    const [stock,SetStock] = useState("");  // stock el atributo en la bd ,setStock lo que se asignara al escribirle,  y el useState aparece en cero 
   

    const [stock_minimo,SetStockMinimo] = useState("");
    const [stock_maximo,SetStockMaximo] = useState("");
    const [editingProducto, setEditingProducto] = useState(null);

    const [seleccionado, setSeleccionado] = useState(false);// para desabilitar select producto y no lo vuelva a utilizar
   
    const [searchTerm, setSearchTerm] = useState("");  // Estado para el término de búsqueda--------
    const [filteredProducts, setFilteredProducts] = useState([]);  // Productos filtrados-----

  


    //CODIGO PARA REGSITRAR ENTRADA STOCK
    const [idProductoEntrada, setIdProductoEntrada] = useState(""); // ID del producto
    const [cantidadEntrada, setCantidadEntrada] = useState(""); // Cantidad de la entrada de stock
    //hasta aqui termina el codigo de entrada stock

    const [modalOpen, setModalOpen] = useState(false);//modal registro y actualizacion de productos
    const [stockModalOpen, setStockModalOpen] = useState(false); // Modal de entrada de stock
    const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para almacenar el producto seleccionado

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [errors, setErrors] = useState({});

 // Validación del formulario
    const validateForm = () => {
    const stockParsed = parseFloat(stock);
    const stockMinimoParsed = parseFloat(stock_minimo);
    const stockMaximoParsed = parseFloat(stock_maximo);
    let formErrors = {};


    //Validaciones generales
  
    if (!nombreProducto) {
      formErrors.nombreProducto = "El nombre del producto es obligatorio.";
    }
    if (!stock || isNaN(stockParsed)) {
      formErrors.stock = "El stock debe ser un número válido.";
    }
    if (!stock_minimo || isNaN(stockMinimoParsed)) {
      formErrors.stock_minimo = "El stock mínimo debe ser un número válido.";
    }
    if (!stock_maximo || isNaN(stockMaximoParsed)) {
      formErrors.stock_maximo = "El stock máximo debe ser un número válido.";
    }
  
    if (stockParsed < 0 || stockMinimoParsed < 0 || stockMaximoParsed < 0) {
      formErrors.stockNegative = "Los valores de stock no pueden ser negativos.";
    }
  
   
    // Validaciones  para registrar
    if (!editingProducto) {//este esta con una ! es para registro
        if (stockParsed < stockMinimoParsed) {
        formErrors.stockMinimoInvalid =
            "El stock inicial no puede ser menor al stock mínimo.";
        }
        if (stockParsed > stockMaximoParsed) {
        formErrors.stockMaximoInvalid =
            "El stock inicial no puede exceder el stock máximo.";
        }
    }

  // Validaciones  para la  actualización
  if (editingProducto && stockParsed > stockMaximoParsed) {//esta esta sin la (!) es
    formErrors.stockMaximoInvalid =
      "El stock inicial no puede exceder el stock máximo.";
  }

    // Validaciones específicas para actualización
    if (editingProducto) {
        if (stockParsed > stockMaximoParsed) {
          formErrors.stockMaximoInvalid =
            "El stock inicial no puede exceder el stock máximo.";
        }
      }

  // Validaciones comunes
  if (stockMinimoParsed > stockMaximoParsed) {
    formErrors.stockMinMax = "El stock mínimo no puede exceder el stock máximo.";
  }
  
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  

  // Manejo de formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (editingProducto) {
      actualizarProducto();
    } else {
      registrarProducto();
    }
  };


  // Rutas para CRUD
  // Función para cargar los productos inicialmente
  const listarProductos = async () => {
    try {
      const res = await axiosClient.get("bodega/listar");
      if (res.data.length > 0) {
        setProductos(res.data);
        setFilteredProducts(res.data);  // Inicialmente mostramos todos los productos
      }
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };
   // Función para manejar la búsqueda a medida que se escribe
   const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);  // Actualiza el término de búsqueda

    if (term === "") {
      setFilteredProducts(productos);  // Si no hay texto de búsqueda, mostramos todos los productos
      return;
    }

    try {
      const response = await axiosClient.get(`/bodega/buscar/${term}`);
      setFilteredProducts(response.data);  // Actualizamos los productos filtrados
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setFilteredProducts([]);  // Si no hay productos, mostramos vacío
    }
  };

  const registrarProducto = async () => {
    try {
        // Verificar si el nombre del producto ya existe
        const resVerificar = await axiosClient.post("/nombre/verificar", { nombre: nombreProducto });
        if (resVerificar.status === 400) {
            // Si el nombre ya existe, muestra un mensaje de error
            Swal.fire({
                title: "Error",
                text: resVerificar.data.message,
                icon: "error",
            });
            return; // No registrar el producto si el nombre ya existe
        }

        // Si la validación es exitosa, registra el producto
        const res = await axiosClient.post("bodega/registrar", {
            nombre_producto: nombreProducto,
            stock,
            stock_minimo,
            stock_maximo,
        });
        if (res.status === 200) {
            setModalOpen(false);   // Cerrar el modal
            listarProductos();     // Actualizar la lista de productos
            resetForm();           // Limpiar el formulario
            Swal.fire({
                title: "Producto Registrado",
                text: res.data.message,
                icon: "success",
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Error",
            text: "El nombre del producto ya esta en la base de datos.",
            icon: "error",
        });
    }
};

const actualizarProducto = async () => {
    try {
        // Verificar si el nuevo nombre ya existe en la base de datos
        const resVerificar = await axiosClient.post("/nombre/verificar", {
            nombre: nombreProducto,
            id: editingProducto, // Enviamos el ID del producto actual para excluirlo de la verificación
        });

        if (resVerificar.status === 400) {
            // Si el nombre ya existe, muestra un mensaje de error
            Swal.fire({
                title: "Error",
                text: resVerificar.data.message,
                icon: "error",
            });
            return; // No proceder con la actualización
        }

        // Realizar la solicitud de actualización
        const res = await axiosClient.put(`bodega/actualizar/${editingProducto}`, {
            nombre_producto: nombreProducto,
            stock,
            stock_minimo,
            stock_maximo,
        });

        if (res.status === 200) {
            listarProductos(); // Actualizar la lista de productos
            resetForm(); // Limpiar el formulario
            setEditingProducto(null); // Limpiar el estado del producto en edición
            setModalOpen(false); // Cerrar el modal
            Swal.fire({
                title: "Producto Actualizado",
                text: res.data.message,
                icon: "success",
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Error",
            text: "El nombre del producto ya esta en la base de datos.",
            icon: "error",
        });
    }
};


const eliminarProducto = async (id) => {
  try {
    // Elimina el producto del servidor
    await axiosClient.delete(`/bodega/eliminar/${id}`);

    // Actualiza la lista completa de productos
    await listarProductos();

    // Actualiza la lista filtrada
    const updatedFiltered = filteredProducts.filter((item) => item.id !== id);

    // Calcula las nuevas páginas totales
    const updatedTotalPages = Math.ceil(updatedFiltered.length / itemsPerPage);

    // Ajusta la página actual si está vacía
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages > 0 ? updatedTotalPages : 1);
    }

    // Actualiza el estado de productos filtrados
    setFilteredProducts(updatedFiltered);

    // Muestra mensaje de éxito
    Swal.fire({
      title: "Producto Eliminado",
      text: "El producto ha sido eliminado correctamente.",
      icon: "success",
    });
  } catch (error) {
    console.error(error);

    // Muestra mensaje de error
    Swal.fire({
      title: "Error",
      text: "Ocurrió un problema al eliminar el producto.",
      icon: "error",
    });
  }
};


  const buscarProducto = async () => {
    try {
      // Validación de que el término de búsqueda no esté vacío o solo tenga espacios
      if (!searchTerm.trim()) {
        Swal.fire("Error", "Por favor ingresa un término de búsqueda", "error");
        return; // Detener la ejecución si no se ingresa un término válido
      }
  
      // Realizar la solicitud solo si el término es válido
      const res = await axiosClient.get(`/bodega/buscar/${searchTerm.trim()}`);
      
      // Guardar los resultados de la búsqueda
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error al buscar producto:", error);
      // Mostrar mensaje de error si la búsqueda no tiene éxito
      Swal.fire("Error", "No se encontró el producto", "error");
    }
  };
  

 // Función para manejar la búsqueda en tiempo real
const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchTerm(query); // Actualiza el término de búsqueda

  if (!query.trim()) {
    // Si la búsqueda está vacía, mostrar todos los productos
    setFilteredProducts(productos);
    return;
  }

  // Filtrar localmente los productos por nombre
  const filtered = productos.filter((producto) =>
    producto.nombre_producto.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredProducts(filtered);
};


  const handleRegistrarEntradaStock = async (e) => {
      e.preventDefault();


        // Verificar si el producto está seleccionado
    if (!idProductoEntrada) {
      Swal.fire({
        title: "Error",
        text: "Debe seleccionar un producto antes de registrar la entrada.",
        icon: "error",
      });
      return;
    }

    // Validación de cantidad
    if (isNaN(cantidadEntrada) || cantidadEntrada <= 0) {
      Swal.fire({
        title: "Error",
        text: "La cantidad debe ser un número válido y mayor que 0.",
        icon: "error",
      });
      return;
    }
  
    try {
      const res = await axiosClient.post("/bodega/registrare", {
        id_producto: idProductoEntrada,  // Asegúrate de que este sea el ID correcto
        cantidad: cantidadEntrada,       // Asegúrate de que la cantidad es la correcta
      });
  
      if (res.status === 200) {
        Swal.fire({
          title: "Entrada de Stock Registrada",
          text: res.data.message,
          icon: "success",
        });
        
        // Limpiar los campos y cerrar el modal después de registrar la entrada
        setStockModalOpen(false);  // Cerrar el modal de entrada de stock
        setIdProductoEntrada("");  // Limpiar el ID del producto seleccionado
        setCantidadEntrada("");    // Limpiar la cantidad ingresada
        setProductoSeleccionado(null);  // Limpiar el producto seleccionado

        listarProductos();         // Actualizar la lista de productos
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: " La cantidad que intenta ingresar supera el stock maximo del producto.",
        icon: "error",
      });
    }
};


  const handleCloseModal = () => {
    setStockModalOpen(false);  // Cierra el modal
    setIdProductoEntrada("");  // Limpia el ID del producto
    setCantidadEntrada("");    // Limpia la cantidad
    setProductoSeleccionado(null); // Limpia el producto seleccionado
  };
  
  
  // Cuando selecciones un producto, asegúrate de setear su id y nombre
  const handleSeleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);  // Establece el producto seleccionado
    setIdProductoEntrada(producto.id);  // Establece el ID del producto seleccionado
    setStockModalOpen(true);  // Abre el modal
     // Limpiar los campos para asegurarse de que estén vacíos al abrir el modal
     setCantidadEntrada(""); // Limpia la cantidad
};

{productos.map((producto) => (
    <div key={producto.id}>
      <button onClick={() => handleSeleccionarProducto(producto)}>
        Seleccionar {producto.nombre_producto}
      </button>
    </div>
  ))}
  
  const handleEdit = (producto) => {
    setEditingProducto(producto.id);
    setNombreProducto(producto.nombre_producto);
    SetStock(producto.stock);
    SetStockMinimo(producto.stock_minimo);
    SetStockMaximo(producto.stock_maximo);
    setErrors({});
    setModalOpen(true);
  };

  const resetForm = () => {
    setNombreProducto("");
    SetStock("");
    SetStockMinimo("");
    SetStockMaximo("");
    setErrors({});
    setEditingProducto(null);
  };

  useEffect(() => {// es un hok el cual permite llamaro traer los datos de la bd
    listarProductos();
  }, []);

// Constantes necesarias para la paginación
const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);  // Usamos filteredProducts para la paginación
const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mt-[-28px]"> {/* Ajuste de margen superior */}
      <div className="h-[calc(100vh-52px)] bg-white"> {/* Fondo de color */}
        {/* Encabezado y botones */}
        <div className="flex items-center mb-4 gap-4">
          <div
            className="flex items-center bg-black border border-gray-700 rounded-lg shadow-lg p-4 text-lg font-bold text-white"
            style={{ marginLeft: "20px", marginTop: "30px", width: "fit-content" }}
          >
            <FaBoxOpen className="text-white text-2xl mr-2" />
            <h1>BODEGA</h1>
          </div>
  
          <div className="flex flex-wrap gap-4 mt-[30px] ml-[20px] md:ml-[60px] lg:ml-[180px]">
            {/* Botón: Registrar Nuevo Producto */}
            <button
              className="flex items-center bg-green-800 text-white px-4 py-2 font-bold text-sm hover:bg-green-700 gap-2"
              style={{ borderRadius: "10px" }}
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
            >
              <MdAddBusiness className="text-xl md:text-2xl lg:text-3xl" />
              <span className="text-center">
                Registrar Nuevo <br /> Producto
              </span>
            </button>
  
            {/* Botón: Registrar Entrada de Stock */}
            <button
              className="flex items-center bg-[#1E3A8A] text-white px-4 py-2 font-bold text-sm hover:bg-[#34548C] gap-2"
              style={{ borderRadius: "10px" }}
              onClick={() => setStockModalOpen(true)}
            >
              <FaDoorOpen className="text-xl md:text-2xl lg:text-3xl" />
              <span className="text-center">
                Registrar Entrada <br /> de Stock
              </span>
            </button>
          </div>
        </div>

      {/* Barra de búsqueda */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        {/* Contenedor del ícono y el input */}
        <div className="flex items-center border border-gray-600 rounded p-2 w-full sm:w-auto  shadow-md hover:shadow-lg transition-shadow duration-200">
          <FcSearch className="text-xl sm:text-2xl lg:text-3xl mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} // Manejar búsqueda local
            onBlur={() => buscarProductoServidor(searchTerm)} // Opcional: Búsqueda en servidor al perder el foco
            placeholder="Buscar producto..."
            className="flex-1 p-2 border-none outline-none border-radius black"
          />
        </div>
      </div>

        <div className="flex justify-center">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full text-sm text-gray-800">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Nombre del producto</th>
                  <th className="px-6 py-3 text-center">Cantidad Actual</th>
                  <th className="px-6 py-3 text-center">Stock Mínimo</th>
                  <th className="px-6 py-3 text-center">Stock Máximo</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
                <tbody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((producto, index) => (
                      <tr
                        key={producto.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-blue-100`}
                      >
                        <td className="px-6 py-4 text-center">{producto.nombre_producto}</td>
                        <td className="px-6 py-4 text-center">{producto.stock}</td>
                        <td className="px-6 py-4 text-center">{producto.stock_minimo}</td>
                        <td className="px-6 py-4 text-center">{producto.stock_maximo}</td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                         {/* Botón Editar */}
                        <button
                          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 transition"
                          onClick={() => handleEdit(producto)}
                        >
                          <FaEdit className="text-lg" />
                          <span>Editar</span>
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <RiDeleteBin6Line className="text-lg" />
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No hay productos registrados con ese nombre.
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-300 mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded mx-1 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-300 mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl mb-4">
              {editingProducto ? "Editar Producto" : "Registrar Producto"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1">Nombre del Producto:</label>
                <input
                  type="text"
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  className="w-full p-2 border" 
                />
                {errors.nombreProducto && (
                  <p className="text-red-500 text-sm">{errors.nombreProducto}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">Stock:</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => SetStock(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">Stock Mínimo:</label>
                <input
                  type="number"
                  value={stock_minimo}
                  onChange={(e) => SetStockMinimo(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                {errors.stock_minimo && (
                  <p className="text-red-500 text-sm">{errors.stock_minimo}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">Stock Máximo:</label>
                <input
                  type="number"
                  value={stock_maximo}
                  onChange={(e) => SetStockMaximo(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                {errors.stock_maximo && (
                  <p className="text-red-500 text-sm">{errors.stock_maximo}</p>
                )}
              </div>
              {errors.stockNegative && (
                <p className="text-red-500 text-sm">{errors.stockNegative}</p>
              )}
              {errors.stockMinimoInvalid && (
                <p className="text-red-500 text-sm">
                  {errors.stockMinimoInvalid}
                </p>
              )}
              {errors.stockMaximoInvalid && (
                <p className="text-red-500 text-sm">
                  {errors.stockMaximoInvalid}
                </p>
              )}
              {errors.stockMinMax && (
                <p className="text-red-500 text-sm">{errors.stockMinMax}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingProducto ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Entrada de Stock */}
      {stockModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl mb-4">
                Entrada de Stock para {productoSeleccionado?.nombre_producto || "Seleccionar Producto"}
            </h2>
            <form onSubmit={handleRegistrarEntradaStock}>
                {/* Campo para seleccionar el producto */}
                <div>
                <label className="block mb-1">Seleccionar Producto:</label>
                    <select
                    value={idProductoEntrada}
                    onChange={(e) => {
                        setIdProductoEntrada(e.target.value);
                        if (e.target.value !== "") {
                        setSeleccionado(true);
                        }
                    }}
                    className="w-full p-2 border rounded"
                    style={{ maxHeight: '60px', overflowY: 'auto' }} // Se ajusta la altura para 5 productos
                    >
                    <option value="" disabled={seleccionado}>Seleccione un producto</option>
                    {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                        {producto.nombre_producto}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Campo para ingresar la cantidad */}
                <div>
                <label className="block mb-1">Cantidad a ingresar:</label>
                <input
                    type="number"
                    value={cantidadEntrada}
                    onChange={(e) => setCantidadEntrada(e.target.value)} // Actualiza el estado con la cantidad ingresada
                    className="w-full p-2 border rounded"
                />
                {errors.cantidadIngreso && (
                    <p className="text-red-500 text-sm">{errors.cantidadIngreso}</p>
                )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={handleCloseModal} // Cierra el modal y limpia los campos
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Confirmar
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

export default Bodega