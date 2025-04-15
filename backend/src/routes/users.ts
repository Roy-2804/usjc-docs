import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY created_at DESC LIMIT 20");
    res.status(200).json(rows);
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

export default router;
