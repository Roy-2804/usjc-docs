import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { name, email, role } = req.query;
  let sql = "SELECT * FROM users WHERE 1 = 1";
  const values: any[] = [];

  if (name) {
    sql += " AND name LIKE ?";
    values.push(`%${name}%`);
  }

  if (email) {
    sql += " AND email LIKE ?";
    values.push(`%${email}%`);
  }

  if (role) {
    sql += " AND role LIKE ?";
    values.push(`%${role}%`);
  }

  try {
    const [rows] = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id=${id}`);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

router.post("/new-user", async (req: Request, res: Response): Promise<any> => {
  const { name, email, pass, role } = req.body.data;

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);

    if ((existing as any).length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const sql = `INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())`;
    await pool.query(sql, [name, email, hashedPassword, role]);

    res.status(201).json({ message: "Usuario creado exitosamente." });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

router.put("/update/user/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  
  const { name, email, pass, role } = req.body.data;
  
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });
  
  try {
    const sql = `UPDATE users SET
      name = ?, email = ?, password = ?, role = ?
      WHERE id = ?`;

    const values = [
      name,
      email,
      pass,
      role,
      id,
    ];
    
    const resultado = await pool.query(sql, values);
    res.status(200).json({ message: "Expediente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar expediente:", error);
    res.status(500).json({ error: "Error al actualizar expediente" });
  }
});

router.delete("/delete/user/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar Usuario:", error);
    res.status(500).json({ message: "Error al eliminar Usuario" });
  }
});

export default router;
