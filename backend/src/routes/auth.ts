import { Router } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Login
router.post("/login", async (req, res) => {
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

router.get("/test", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});
  

export default router;
