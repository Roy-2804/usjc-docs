"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/new-doc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, idNumber, idType, gender, grade, career, modalidadGraduacion, documentosAdjuntos, convalidaciones, boletasMatricula, tcu, historialAcademico, documentacionAdicional, actasCalificacion, qualifications, studentCondition, studentState, studentRegistration, link, subjectCount } = req.body.data;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const query = `
      INSERT INTO docs (
        studentName, idNumber, idType, gender, grade, career, modalidadGraduacion,
        documentosAdjuntos, convalidaciones, boletasMatricula, tcu,
        historialAcademico, documentacionAdicional, actasCalificacion, qualifications, studentCondition,
        studentState, studentRegistration, link, subjectCount, creado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        yield db_1.pool.query(query, [
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
    }
    catch (err) {
        console.error("Error al registrar expediente:", err);
        res.status(500).json({ error: "Error al registrar expediente" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, idNumber, gender, grade, career, studentState } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const offset = (page - 1) * limit;
    let sql = "FROM docs WHERE 1 = 1";
    const values = [];
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
        const [countRows] = yield db_1.pool.query(`SELECT COUNT(*) as total ${sql}`, values);
        const total = countRows[0].total;
        // Obtener registros paginados
        const [rows] = yield db_1.pool.query(`SELECT * ${sql} LIMIT ? OFFSET ?`, [...values, limit, offset]);
        res.json({
            data: rows,
            total,
            page,
            limit
        });
    }
    catch (err) {
        console.error("Error al obtener expedientes:", err);
        res.status(500).json({ error: "Error al obtener expedientes" });
    }
}));
router.get("/node/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const expediente = yield db_1.pool.query(`SELECT * FROM docs WHERE id=${id}`);
        res.status(200).json(expediente);
    }
    catch (err) {
        console.error("Error al obtener expedientes:", err);
        res.status(500).json({ error: "Error al obtener expedientes" });
    }
}));
router.put("/update/node/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { studentName, idNumber, idType, gender, grade, career, modalidadGraduacion, documentosAdjuntos, convalidaciones, boletasMatricula, tcu, historialAcademico, documentacionAdicional, actasCalificacion, studentCondition, studentState, studentRegistration, qualifications, link, subjectCount, } = req.body.data;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
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
        const resultado = yield db_1.pool.query(sql, values);
        res.status(200).json({ message: "Expediente actualizado correctamente" });
    }
    catch (error) {
        console.error("Error al actualizar expediente:", error);
        res.status(500).json({ error: "Error al actualizar expediente" });
    }
}));
router.delete("/delete/node/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield db_1.pool.query("DELETE FROM docs WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expediente no encontrado" });
        }
        res.json({ message: "Expediente eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar Expediente:", error);
        res.status(500).json({ message: "Error al eliminar Expediente" });
    }
}));
exports.default = router;
