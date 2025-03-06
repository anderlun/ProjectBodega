import { pool } from "../database/conexion.js";

// Controlador para verificar si un producto con el mismo nombre ya existe
export const verificarNombreProducto = async (req, res) => {
    try {
        const { nombre, id } = req.body; // Incluye el ID para distinguir registro de actualización

        if (!nombre) {
            return res.status(400).json({ message: "El nombre del producto es obligatorio." });
        }

        const sql = id
            ? "SELECT * FROM bodega_aseo WHERE LOWER(nombre_producto) = LOWER(?) AND id != ?"
            : "SELECT * FROM bodega_aseo WHERE LOWER(nombre_producto) = LOWER(?)";

        const params = id ? [nombre, id] : [nombre];
        const [rows] = await pool.query(sql, params);

        if (rows.length > 0) {
            return res.status(400).json({ message: "Este producto ya existe en la base de datos." });
        }

        return res.status(200).json({ message: "El nombre es válido." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
