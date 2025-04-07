import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/verifyToken";

const router = Router();

// Login
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  
  try {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "2h" });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/profile", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const user = (req as any).user;
  
  try {
    const [rows]: any = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener perfil", error });
  }
});  

export default router;
