import { pool } from "../database/conexion.js";
import bcrypt from "bcrypt";

export const listarUser = async (req, res) => {
  try {
    const sql = `SELECT * FROM usuarios`;
    const [rows] = await pool.query(sql);
    if (rows.length > 0) {
      return res.status(200).json(rows);
    } else {
      return res.status(202).json({ message: "No hay datos" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const sql = `INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES(?,?,?,?)`;
    const [rows] = await pool.query(sql, [nombre, email, hashedPassword, rol]);
    if (rows.affectedRows > 0) {
      return res.status(200).json({ message: "Usuario registrado exitosamente" });
    } else {
      return res.status(202).json({ message: "Error al registrar" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const eliminarUser = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    const [rows] = await pool.query(sql,[id]);
    if (rows.affectedRows > 0) {
      return res.status(200).json({ message: "persona eliminado" });
    } else {
      return res.status(202).json({ message: "Error al eliminar sonso" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const buscarUser = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    const [rows] = await pool.query(sql,[id]);
    if (rows.length > 0) {
      return res.status(200).json(rows);
    } else {
      return res.status(202).json({ message: "No se encontró el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, email,contraseña,rol } = req.body;
    const sql = `UPDATE usuarios SET nombre = ?, email = ?, contraseña = ?, rol = ? WHERE id = ?`;
    const [rows] = await pool.query(sql,[nombre, email,contraseña,rol, id]);
    if (rows.affectedRows > 0) {
      return res.status(200).json({ message: "usuario actualizado" });
    } else {
      return res.status(202).json({ message: "Error al actualizar sonso" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


