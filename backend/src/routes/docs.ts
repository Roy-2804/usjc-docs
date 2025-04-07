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
        studentCondition,
        studentState,
        studentPeriod,
        studentRegistration,
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
        historialAcademico, documentacionAdicional, actasCalificacion, studentCondition,
        studentState, studentPeriod, studentRegistration, creado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      studentCondition,
      studentState,
      studentPeriod,
      studentRegistration,
      userId,
    ]);

    res.status(201).json({ message: "Expediente registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar expediente:", err);
    res.status(500).json({ error: "Error al registrar expediente" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM docs ORDER BY creado_en DESC LIMIT 20");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener expedientes:", err);
    res.status(500).json({ error: "Error al obtener expedientes" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expediente = await pool.query(`SELECT * FROM docs WHERE id=${id}`);
    res.status(200).json(expediente);
  } catch (err) {
    console.error("Error al obtener expedientes:", err);
    res.status(500).json({ error: "Error al obtener expedientes" });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
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
    studentCondition,
    studentState,
    studentPeriod,
    studentRegistration,
  } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const sql = `UPDATE expedientes SET
      studentName = ?, idNumber = ?, idType = ?, grade = ?, career = ?,
      modalidadGraduacion = ?, documentosAdjuntos = ?, convalidaciones = ?,
      boletasMatricula = ?, tcu = ?, historialAcademico = ?, documentacionAdicional = ?,
      actasCalificacion = ?, studentCondition = ?, studentState = ?, studentPeriod = ?,
      studentRegistration = ?
      WHERE id = ?`;

    const values = [
      studentName, idNumber, idType, grade, career,
      modalidadGraduacion, JSON.stringify(documentosAdjuntos), JSON.stringify(convalidaciones),
      JSON.stringify(boletasMatricula), JSON.stringify(tcu), JSON.stringify(historialAcademico),
      JSON.stringify(documentacionAdicional), JSON.stringify(actasCalificacion),
      studentCondition, studentState, studentState, studentPeriod, studentRegistration,
      id
    ];

    await pool.query(sql, values);
    res.status(200).json({ message: "Expediente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar expediente:", error);
    res.status(500).json({ error: "Error al actualizar expediente" });
  }
});

export default router;
