import { pool } from "../database/conexion.js";


//controlador para agregar encargados  en caso en que lleguen mas (crear el boton solo para agregarlos)
export const agregarEncargados = async (req, res) => {
    try {
        const {nombre_encargado} = req.body;

        const sql = `INSERT INTO encargados (nombre_encargado) VALUES (?)`;
        const [rows] = await pool.query(sql,[nombre_encargado]);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ message:"encargado registrado"});

        } else{
            return res.status(400).json({ message: "error a registrar encargado"})
        }
        
    } catch (error) {
      return res.status(500).json({ message: error.message });
        
    }
}; 
//NOTA EN LA LISTA DE ENCARGADOS Y EL ELIMINAR SE PUEDE HACER A FUTURO EN DADO CASO QUE LO QUIERA
//POR AHORA DEJARLO QUE SOLO REGISTRE ENCARGADOS Y SI QUIERE AGREGAR EN EL TEMPLATE UNA VISTA PARA VER LOS ENCARGADOS PUES PODEMOS DEJARLA
//EN DADO CASO QUE QUIERA VER, PERO HASTA EL MOMENTO SOLO REGISTRAR EL BOTON ENCARGADO EN CASO DE MEJORA
//O ACTUALIZACION SE PUEDE HACER UNA MEJORA DEL SOFTWARE 2.0 EN EL CUAL  MUESTRE LOS ENCARGADOS Y DEJE ELIMINARLO Y LISTARLOS Y METERLE MAS INFO

//EN POCAS PALABRAS POR EL MOMENTO  DEJAR SOLO EL BOTON DE AGREGAR ENCARGADOS Y SI QUIEREN MEJORA SERA PARA EL SOFTWARE 2.0

//controlador  para que me listen los encargados de su propia tabla  y despues pasarlo al frontend donde al momento de realizar el registro de salida_bateria me muestre en el campo una lista de los ENCARGADOS
export const listarEncargados = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT id, nombre_encargado FROM encargados";
    const queryParams = [];

    if (search) {
      query += " WHERE nombre_encargado LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += " ORDER BY id DESC"; // Ordenar por ID en orden descendente

    const [rows] = await pool.query(query, queryParams);

    if (rows.length > 0) {
      return res.status(200).json(rows);
    } else {
      return res.status(404).json({ message: "No se encontraron encargados." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



  

  export const eliminarEncargados = async (req, res) => {
   try {
      const id = req.params.id;
      const sql = `DELETE FROM encargados WHERE id = ?`;
      const [rows] = await pool.query(sql,[id]);

      if (rows.affectedRows > 0){
        return res.status(200).json({ message: "encargado eliminado exitosamente"});

      } else{
        return res.status(404).json({ message: "encargado no encontrado"})
      }
      
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }
    
  };


  export const actualizarEncargado = async (req, res) => {
    try {
      const { id } = req.params;  // Obtener el ID del encargado desde los parámetros
      const { nombre_encargado } = req.body;  // Obtener el nuevo nombre del encargado desde el cuerpo de la solicitud
      
      // Verificar que el nombre no esté vacío
      if (!nombre_encargado) {
        return res.status(400).json({ message: "El nombre del encargado es obligatorio." });
      }
  
      // Actualizar el encargado en la base de datos
      const sql = `UPDATE encargados SET nombre_encargado = ? WHERE id = ?`;
      const [rows] = await pool.query(sql, [nombre_encargado, id]);
  
      // Verificar si la actualización fue exitosa
      if (rows.affectedRows > 0) {
        return res.status(200).json({ message: "Encargado actualizado exitosamente" });
      } else {
        return res.status(404).json({ message: "Encargado no encontrado" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


