import { pool } from "../database/conexion.js"; 
//CONTROL + D para seleccionar palabra por palabra
// el PUT y POST  se usa error 400 por si un dato esta mal escrito o falto campo por llenar
//GET y DELETE se usan con error 404 por si no se encuentra el producto o no existe en la BD

// Controlador para listar todos los productos de la bodega (con toda la información para crear la tabla almomento que se registre productos en bodega y se apareazca abajo tendre que utilizar un enjoin para que no se muestre los id del producto si no el nombre )
export const listarProductosCompletos = async (req, res) => {
    try {
      const sql = "SELECT * FROM bodega_aseo ORDER BY id DESC"; // Obtenemos todas las columnas de la tabla bodega_aseo y order by desc significa descendente que se veran primero los datos nuevos  y de ultimos los viejos
      const [rows] = await pool.query(sql);
  
      if (rows.length > 0) {
        return res.status(200).json(rows); // Enviamos toda la lista de productos al frontend
      } else {
        return res.status(404).json({ message: "No se encontraron productos." });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


// Controlador para listar los productos de la bodega (solo ID y nombre al momento de hacer el boton que registrara este producto con su stock el boton de registrar prodcutos ya creados)
//este tambien servira para listar los productos para ver los nombres a la hora de hacer salida_bateria

//recuerda una cosa es listar los productos para que se vean  toda la fila en la taba de la salida de registro y ver esa informacion en una tabla para luego imprimir pdf igual en bodega el cual veran los ids
//esta parte se la dije a luis es con enjoin y en salidabateria hay un ejemplo de ello

// y otra cosa es ver como tal los productos a seleccionar lo cual aplicaria esta funcion listarProductos
//esto es en el modalOpen al abrir para seleccionar el nombre que hay y no su id
export const listarProductos = async (req, res) => {
  try {
    const sql = "SELECT id, nombre_producto FROM bodega_aseo"; 
    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      return res.status(200).json(rows); // Enviamos la lista de productos al frontend
    } else {
      return res.status(404).json({ message: "No se encontraron productos." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// 

// Controlador para registrar un nuevo producto en la bodega (con validación de stock  máximo)
export const registrarProducto = async (req, res) => {
  try {
    // Extraer y validar los datos del cuerpo de la solicitud
    const { nombre_producto, stock, stock_minimo, stock_maximo } = req.body;

    // Validar que todos los campos existan y sean del tipo esperado
    if (!nombre_producto || typeof nombre_producto !== "string") {
      return res.status(400).json({ message: "El nombre del producto es obligatorio y debe ser un texto válido." });
    }

    const stockParsed = Number(stock);
    const stockMinimoParsed = Number(stock_minimo);
    const stockMaximoParsed = Number(stock_maximo);

    if (isNaN(stockParsed) || isNaN(stockMinimoParsed) || isNaN(stockMaximoParsed)) {
      return res.status(400).json({ message: "Stock, stock mínimo y stock máximo deben ser números válidos." });
    }

    // Validación de valores lógicos
    if (stockParsed < 0 || stockMinimoParsed < 0 || stockMaximoParsed < 0) {
      return res.status(400).json({ message: "Los valores de stock no pueden ser negativos." });
    }

    if (stockParsed < stockMinimoParsed) {
      return res.status(400).json({ message: "El stock inicial no puede ser menor al stock mínimo." });
    }

    if (stockParsed > stockMaximoParsed) {
      return res.status(400).json({ message: "El stock inicial no puede exceder el stock máximo." });
    }

    if (stockMinimoParsed > stockMaximoParsed) {
      return res.status(400).json({ message: "El stock mínimo no puede exceder el stock máximo." });
    }

    // Verificar si el producto ya existe (sin importar mayúsculas/minúsculas)
    const sqlCheck = `SELECT COUNT(*) as count FROM bodega_aseo WHERE LOWER(nombre_producto) = LOWER(?)`;
    const [checkResult] = await pool.query(sqlCheck, [nombre_producto]);

    if (checkResult[0].count > 0) {
      return res.status(400).json({ message: "El producto ya existe en la base de datos." });
    }
    
    // Insertar el nuevo producto en la base de datos
    const sql = `INSERT INTO bodega_aseo (nombre_producto, stock, stock_minimo, stock_maximo) VALUES (?, ?, ?, ?)`;
    const [rows] = await pool.query(sql, [nombre_producto, stockParsed, stockMinimoParsed, stockMaximoParsed]);

    // Comprobar si la inserción fue exitosa
    if (rows.affectedRows > 0) {
      return res.status(200).json({ message: "Producto registrado correctamente." });
    } else {
      return res.status(400).json({ message: "Error al registrar el producto en la base de datos." });
    }
  } catch (error) {
    console.error("Error en el servidor:", error.message); // Log para depuración
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Controlador para registrar la entrada de un nuevo stock 
export const registrarEntradaStock = async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;

    // Verificamos que se hayan recibido los datos necesarios
    if (!id_producto || !cantidad) {
      return res.status(400).json({ message: "Debe proporcionar el ID del producto y la cantidad." });
    }

    // Validación adicional para verificar que la cantidad sea un número válido y mayor que 0
    if (isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser un número válido y mayor que 0." });
    }

    // Buscamos el producto en la base de datos para obtener el stock actual, stock mínimo y stock máximo
    const sqlBusqueda = `SELECT id, stock, stock_minimo, stock_maximo FROM bodega_aseo WHERE id = ?`;
    const [producto] = await pool.query(sqlBusqueda, [id_producto]);

    // Si el producto no existe, devolvemos un error
    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado en la bodega." });
    }

    const { stock, stock_minimo, stock_maximo } = producto[0];

    // Calculamos el nuevo stock
    const nuevo_stock = stock + parseInt(cantidad);

    // Verificamos que el nuevo stock no exceda el stock máximo
    if (nuevo_stock > stock_maximo) {
      return res.status(400).json({ message: `El nuevo stock excede el límite máximo permitido de ${stock_maximo}.` });
    }

    // El stock mínimo ya no se valida, ya que lo que importa es no exceder el máximo
    // Actualizamos el stock en la base de datos
    const sqlActualizacion = `UPDATE bodega_aseo SET stock = ? WHERE id = ?`;
    const [resultado] = await pool.query(sqlActualizacion, [nuevo_stock, id_producto]);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ message: "Entrada de stock registrada correctamente." });
    } else {
      return res.status(400).json({ message: "Error al registrar la entrada de stock." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Controlador para actualizar un producto en la bodega
export const actualizarProducto = async (req, res) => {
  try {
    const id = req.params.id; // Obtenemos el ID desde los parámetros de la URL
    const { nombre_producto, stock, stock_minimo, stock_maximo } = req.body;

    // Validación de que los campos no estén vacíos y sean del tipo esperado
    if (!nombre_producto || typeof nombre_producto !== "string") {
      return res.status(400).json({ message: "El nombre del producto es obligatorio y debe ser un texto válido." });
    }

    const stockParsed = Number(stock);
    const stockMinimoParsed = Number(stock_minimo);
    const stockMaximoParsed = Number(stock_maximo);

    // Validar que stock, stock_minimo y stock_maximo sean números válidos
    if (isNaN(stockParsed) || isNaN(stockMinimoParsed) || isNaN(stockMaximoParsed)) {
      return res.status(400).json({ message: "Stock, stock mínimo y stock máximo deben ser números válidos." });
    }

    // Validación de valores lógicos
    if (stockParsed < 0 || stockMinimoParsed < 0 || stockMaximoParsed < 0) {
      return res.status(400).json({ message: "Los valores de stock no pueden ser negativos." });
    }

  
    if (stockParsed > stockMaximoParsed) {
      return res.status(400).json({ message: "El stock inicial no puede exceder el stock máximo." });
    }

    if (stockMinimoParsed > stockMaximoParsed) {
      return res.status(400).json({ message: "El stock mínimo no puede exceder el stock máximo." });
    }

    // Verificamos que el producto exista
    const sqlBusqueda = "SELECT id FROM bodega_aseo WHERE id = ?";
    const [rows] = await pool.query(sqlBusqueda, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado en la bodega." });
    }

    // Actualizamos los datos del producto
    const sqlActualizar = `
      UPDATE bodega_aseo 
      SET nombre_producto = ?, stock = ?, stock_minimo = ?, stock_maximo = ? 
      WHERE id = ?`;
    const [resultado] = await pool.query(sqlActualizar, [nombre_producto, stockParsed, stockMinimoParsed, stockMaximoParsed, id]);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ message: "Producto actualizado correctamente." });
    } else {
      return res.status(400).json({ message: "Error al actualizar el producto." });
    }
  } catch (error) {
    console.error("Error en el servidor:", error.message); // Log para depuración
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

  

  // Controlador para eliminar un producto de la bodega
  export const eliminarProducto = async (req, res) => {
    try {
      const id = req.params.id; // Obtenemos el ID desde los parámetros de la URL
      // Verificamos que el producto exista
      const sqlBusqueda = "SELECT id FROM bodega_aseo WHERE id = ?";
      const [rows] = await pool.query(sqlBusqueda, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado en la bodega." });
      }

      // Eliminamos el producto
      const sql = "DELETE FROM bodega_aseo WHERE id = ?";
      const [resultado] = await pool.query(sql, [id]);
  
      if (resultado.affectedRows > 0) {
        return res.status(200).json({ message: "Producto eliminado correctamente." });
      } else {
        return res.status(404).json({ message: "Error al eliminar el producto." });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

    // Controlador para buscar un producto por su ID OPCIONAL O MAS ADELANTE HACERLO
// Controlador para buscar un producto por su nombre
export const buscarProducto = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm; // Obtenemos el término de búsqueda desde los parámetros de la URL
    const sql = "SELECT * FROM bodega_aseo WHERE nombre_producto LIKE ?"; // Buscar solo por nombre_producto
    const [rows] = await pool.query(sql, [`%${searchTerm}%`]);
  
    if (rows.length > 0) {
      return res.status(200).json(rows); // Producto encontrado
    } else {
      return res.status(404).json({ message: "Producto no encontrado en la bodega." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
