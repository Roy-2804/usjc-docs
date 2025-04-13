import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";

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

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id)
  try {
    const expediente = await pool.query(`SELECT * FROM docs WHERE id=${id}`);
    res.status(200).json(expediente);
  } catch (err) {
    console.error("Error al obtener expedientes:", err);
    res.status(500).json({ error: "Error al obtener expedientes" });
  }
});

export default router;
