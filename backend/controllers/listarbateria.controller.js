import { pool } from "../database/conexion.js";

//pasar este controlador tambien para la salida de la bateria  para que se vea al momento de realizar
//  registrar_salida de algun prodcuto se vea una lista de los nombres a seleccionar de las baterias que hay
//cabe decir que lo mismo aplica para el  controlador de encargados  y bodega para ver que hay
//con la intencion que los ids no se pongan 
export const listarBaterias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre_bateria FROM baterias");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron baterías." });
    }

    return res.status(200).json(rows); // Enviamos las baterías al frontend
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 


