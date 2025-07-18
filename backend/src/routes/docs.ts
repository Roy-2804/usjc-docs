import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/new-doc", async (req: Request, res: Response): Promise<any> => {
    const {
        studentName,
        idNumber,
        idType,
        gender,
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
        qualifications,
        studentCondition,
        studentState,
        studentRegistration,
        link,
        subjectCount
      } = req.body.data;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const query = `
      INSERT INTO docs (
        studentName, idNumber, idType, gender, grade, career, modalidadGraduacion,
        documentosAdjuntos, convalidaciones, boletasMatricula, tcu,
        historialAcademico, documentacionAdicional, actasCalificacion, qualifications, studentCondition,
        studentState, studentRegistration, link, subjectCount, creado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      studentName,
      idNumber,
      idType,
      gender,
      JSON.stringify(grade),
      JSON.stringify(career),
      modalidadGraduacion,
      JSON.stringify(documentosAdjuntos),
      JSON.stringify(convalidaciones),
      JSON.stringify(boletasMatricula),
      JSON.stringify(tcu),
      JSON.stringify(historialAcademico),
      JSON.stringify(documentacionAdicional),
      JSON.stringify(actasCalificacion),
      JSON.stringify(qualifications),
      studentCondition,
      studentState,
      studentRegistration,
      link,
      subjectCount,
      userId,
    ]);

    res.status(201).json({ message: "Expediente registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar expediente:", err);
    res.status(500).json({ error: "Error al registrar expediente" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const { studentName, idNumber, gender, grade, career, studentState } = req.query;
  let sql = "SELECT * FROM docs WHERE 1 = 1";
  const values: any[] = [];

  if (studentName) {
    sql += " AND studentName LIKE ?";
    values.push(`%${studentName}%`);
  }

  if (idNumber) {
    sql += " AND idNumber LIKE ?";
    values.push(`%${idNumber}%`);
  }

  if (gender) {
    sql += " AND gender = ?";
    values.push(gender);
  }

  if (grade) {
    sql += " AND grade LIKE ?";
    values.push(`%${grade}%`);
  }

  if (career) {
    sql += " AND career LIKE ?";
    values.push(`%${career}%`);
  }

  if (studentState) {
    sql += " AND studentState = ?";
    values.push(studentState);
  }

  try {
    const [rows] = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener expedientes:", err);
    res.status(500).json({ error: "Error al obtener expedientes" });
  }
});

router.get("/node/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expediente = await pool.query(`SELECT * FROM docs WHERE id=${id}`);
    res.status(200).json(expediente);
  } catch (err) {
    console.error("Error al obtener expedientes:", err);
    res.status(500).json({ error: "Error al obtener expedientes" });
  }
});

router.put("/update/node/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  
  const {
    studentName,
    idNumber,
    idType,
    gender,
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
    studentRegistration,
    qualifications,
    link,
    subjectCount,
  } = req.body.data;
  
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });
  
  try {
    const sql = `UPDATE docs SET
      studentName = ?, idNumber = ?, idType = ?, gender = ?, grade = ?, career = ?,
      modalidadGraduacion = ?, documentosAdjuntos = ?, convalidaciones = ?,
      boletasMatricula = ?, tcu = ?, historialAcademico = ?, documentacionAdicional = ?,
      actasCalificacion = ?, studentCondition = ?, studentState = ?, studentRegistration = ?, qualifications = ?, link = ?, subjectCount = ?
      WHERE id = ?`;

    const values = [
      studentName,
      idNumber,
      idType,
      gender,
      JSON.stringify(grade),
      JSON.stringify(career),
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
      studentRegistration,
      qualifications,
      link,
      subjectCount,
      id,
    ];
    
    const resultado = await pool.query(sql, values);
    res.status(200).json({ message: "Expediente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar expediente:", error);
    res.status(500).json({ error: "Error al actualizar expediente" });
  }
});

router.delete("/delete/node/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM docs WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Expediente no encontrado" });
    }

    res.json({ message: "Expediente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar Expediente:", error);
    res.status(500).json({ message: "Error al eliminar Expediente" });
  }
});


export default router;
