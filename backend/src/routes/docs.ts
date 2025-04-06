import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/new-doc", async (req: Request, res: Response): Promise<any> => {
    const {
        studentName,
        idNumber,
        idType,
        grade,
        career,
        modalidadGraduacion,
        documentosAdjuntos,
        convalidaciones,
        boletasMatricula,
        tcu,
        historialAcademico,
        documentacionAdicional,
        actasCalificacion,
      } = req.body.data;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const query = `
      INSERT INTO docs (
        studentName, idNumber, idType, grade, career, modalidadGraduacion,
        documentosAdjuntos, convalidaciones, boletasMatricula, tcu,
        historialAcademico, documentacionAdicional, actasCalificacion, creado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      studentName,
      idNumber,
      idType,
      grade,
      career,
      modalidadGraduacion,
      JSON.stringify(documentosAdjuntos),
      JSON.stringify(convalidaciones),
      JSON.stringify(boletasMatricula),
      JSON.stringify(tcu),
      JSON.stringify(historialAcademico),
      JSON.stringify(documentacionAdicional),
      JSON.stringify(actasCalificacion),
      userId,
    ]);

    res.status(201).json({ message: "Expediente registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar expediente:", err);
    res.status(500).json({ error: "Error al registrar expediente" });
  }
});

export default router;
