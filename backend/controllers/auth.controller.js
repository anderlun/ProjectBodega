import { pool } from "../database/conexion.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    // Verifica si el usuario existe en la base de datos
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const [rows] = await pool.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Compara la contraseña ingresada con la encriptada
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.SECRET,
      { expiresIn: "1d" } // El token expira en 1 dia"1d", si fuera en horas: 1h,2h,3h"
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
