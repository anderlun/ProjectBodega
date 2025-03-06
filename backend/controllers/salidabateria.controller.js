
import { pool } from "../database/conexion.js"; //  esta es la conexion con la BD la cual se importo el pool
import { io } from "../app.js"; // Importar 'io' desde tu archivo app.js
// el PUT y POST  se usa error 400 por si un dato esta mal escrito o falto campo por llenar
//GET y DELETE se usan con error 404 por si no se encuentra el producto o no existe en la BD
// y el error 500 sera general en todos cuando es problema con el servidor

// funcion para registrar la salida de bateria funcionando 
export const registrarSalida = async (req, res) => {
  const connection = await pool.getConnection(); // Inicia una conexión para manejar la transacción
  try {
    const { id_producto, id_bateria, id_encargado, cantidad } = req.body;

    // Inicia la transacción
    await connection.beginTransaction();
    
    // Consulta el stock actual y el stock mínimo del producto
    const [producto] = await connection.query(
      "SELECT stock, stock_minimo, nombre_producto FROM bodega_aseo WHERE id = ?", [id_producto]
    );

    if (producto.length === 0) {
      throw new Error("El producto seleccionado no existe.");
    }

    // Verifica si hay suficiente stock
    const { stock, stock_minimo, nombre_producto } = producto[0];
    if (stock < cantidad) {
      throw new Error("Stock insuficiente para realizar la salida.");
    }

    // Registra la salida en la tabla salidas_bateria
    const sqlInsert = `
      INSERT INTO salidas_bateria (id_producto, id_bateria, id_encargado, cantidad) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.query(sqlInsert, [id_producto, id_bateria, id_encargado, cantidad]);

    // Actualiza el stock en la tabla bodega_aseo
    const sqlUpdate = `UPDATE bodega_aseo SET stock = stock - ? WHERE id = ?`;
    await connection.query(sqlUpdate, [cantidad, id_producto]);

    // Verifica si el stock restante está por debajo del mínimo
    const nuevoStock = stock - cantidad;
    if (nuevoStock <= stock_minimo) {
      io.emit("notification", {
        message: `El producto ${nombre_producto} está por debajo del stock mínimo. ¡Queda solo ${nuevoStock} unidades!`,
      });
    }

    // Elimina los registros de salidas de batería anteriores a las últimas 60 horas
    //en dado caso que funcione y quiera aumentar la durabilidad de losd datos  poner 72 horas aqui y en listar salida tambien 72 horas
    const sqlDeleteOld = `DELETE FROM salidas_bateria WHERE fecha_salida < NOW() - INTERVAL 72 HOUR`;
    await connection.query(sqlDeleteOld);

    // Confirma la transacción
    await connection.commit();

    return res.status(200).json({ message: "Salida registrada exitosamente." });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};



// La actualizada de salida inecesaria o muy dificil


  // listar la salida de bateria  con esto me hace el enjoi para agruparlos nombres y se vea en la tabla 
  //en lugar de sus id

  export const listarSalidaBateria = async (req, res) => {
    try {
      const sql = `
          SELECT 
              sb.id,
              b.nombre_bateria AS bateria,
              p.nombre_producto AS producto,
              e.nombre_encargado AS encargado,
              sb.cantidad,
              sb.fecha_salida
          FROM salidas_bateria sb
          JOIN baterias b ON sb.id_bateria = b.id
          JOIN bodega_aseo p ON sb.id_producto = p.id
          JOIN encargados e ON sb.id_encargado = e.id
          WHERE sb.fecha_salida >= NOW() - INTERVAL 72 HOUR
          ORDER BY sb.id DESC
      `;
  
      // Ejecuta la consulta SQL
      const [rows] = await pool.query(sql);
  
      if (rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "No se encontró información de salidas en las últimas 60 horas" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

//eliminar salida de bateria  

export const eliminarSalidaBateria = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM salidas_bateria WHERE id = ?`;
    const [rows] = await pool.query(sql,[id]);

    if (rows.affectedRows > 0){
        return res.status(200).json({ message: "salida de bateria eliminada exitosamente"});

    }else{
        return res.status(404).json({message: "salida de bateria  no encontrada "})
    }
  } catch(error){
    return res.status(500).json({ message: error.message});
  }

}
