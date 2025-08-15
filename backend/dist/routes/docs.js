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
    const { studentName, idNumber, idType, gender, grade, career, modalidadGraduacion, documentosAdjuntos, convalidaciones, boletasMatricula, tcu, historialAcademico, documentacionAdicional, actasCalificacion, qualifications, studentCondition, studentState, studentRegistration, link, subjectCount, studentGraduations } = req.body.data;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
    const token = authHeader.split(" ")[1];
    let connection;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        connection = yield db_1.pool.getConnection();
        yield connection.beginTransaction();
        const query = `
      INSERT INTO docs (
        studentName, idNumber, idType, gender, grade, career, modalidadGraduacion,
        documentosAdjuntos, convalidaciones, boletasMatricula, tcu,
        historialAcademico, documentacionAdicional, actasCalificacion, studentCondition,
        studentState, studentRegistration, link, subjectCount, creado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const values = [
            studentName,
            idNumber,
            idType,
            gender,
            JSON.stringify(grade),
            JSON.stringify(career),
            JSON.stringify(modalidadGraduacion),
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
            link,
            subjectCount,
            userId,
        ];
        const [result] = yield connection.query(query, values);
        const insertedDocId = result.insertId;
        if (Array.isArray(studentGraduations) && studentGraduations.length > 0) {
            const insertValues = [];
            const placeholders = studentGraduations.map(() => '(?, ?, ?)').join(',');
            for (const graduation of studentGraduations) {
                let qualificationsToInsert = null;
                if (graduation.qualifications) {
                    if (typeof graduation.qualifications === 'string') {
                        qualificationsToInsert = graduation.qualifications;
                    }
                    else if (Array.isArray(graduation.qualifications)) {
                        qualificationsToInsert = JSON.stringify(graduation.qualifications);
                    }
                }
                let graduationToInsert = null;
                if (graduation.graduation) {
                    if (typeof graduation.graduation === 'string') {
                        graduationToInsert = graduation.graduation;
                    }
                    else if (Array.isArray(graduation.graduation)) {
                        graduationToInsert = JSON.stringify(graduation.graduation);
                    }
                }
                insertValues.push(insertedDocId, qualificationsToInsert, graduationToInsert);
            }
            const insertSql = `INSERT INTO user_graduations (uid, qualifications, graduation) VALUES ${placeholders}`;
            yield connection.query(insertSql, insertValues);
        }
        yield connection.commit();
        res.status(201).json({ message: "Expediente registrado correctamente" });
    }
    catch (err) {
        console.error("Error al registrar expediente:", err);
        res.status(500).json({ error: "Error al registrar expediente" });
    }
    finally {
        if (connection)
            connection.release();
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, idNumber, gender, grade, career, studentState } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
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
        // Obtener expediente
        const [docsRows] = yield db_1.pool.query(`SELECT * FROM docs WHERE id = ?`, [id]);
        if (docsRows.length === 0) {
            return res.status(404).json({ error: "Expediente no encontrado" });
        }
        const expediente = docsRows[0];
        // Obtener graduaciones asociadas
        const [graduationsRows] = yield db_1.pool.query(`SELECT qualifications, graduation FROM user_graduations WHERE uid = ?`, [id]);
        // Formar estructura final
        const formData = Object.assign(Object.assign({}, expediente), { studentGraduations: graduationsRows.map((row) => ({
                qualifications: row.qualifications,
                graduation: row.graduation
            })) });
        return res.status(200).json(formData);
    }
    catch (err) {
        console.error("Error al obtener expediente:", err);
        return res.status(500).json({ error: "Error al obtener expediente" });
    }
}));
router.put("/update/node/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { studentName, idNumber, idType, gender, grade, career, modalidadGraduacion, documentosAdjuntos, convalidaciones, boletasMatricula, tcu, historialAcademico, documentacionAdicional, actasCalificacion, studentCondition, studentState, studentRegistration, qualifications, link, subjectCount, studentGraduations } = req.body.data;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
    let connection;
    try {
        connection = yield db_1.pool.getConnection();
        yield connection.beginTransaction();
        const sql = `UPDATE docs SET
      studentName = ?, idNumber = ?, idType = ?, gender = ?, grade = ?, career = ?,
      modalidadGraduacion = ?, documentosAdjuntos = ?, convalidaciones = ?,
      boletasMatricula = ?, tcu = ?, historialAcademico = ?, documentacionAdicional = ?,
      actasCalificacion = ?, studentCondition = ?, studentState = ?, studentRegistration = ?, link = ?, subjectCount = ?
      WHERE id = ?`;
        const values = [
            studentName,
            idNumber,
            idType,
            gender,
            typeof grade === 'string' ? grade : JSON.stringify(grade),
            typeof career === 'string' ? career : JSON.stringify(career),
            typeof modalidadGraduacion === 'string' ? modalidadGraduacion : JSON.stringify(modalidadGraduacion),
            typeof documentosAdjuntos === 'string' ? documentosAdjuntos : JSON.stringify(documentosAdjuntos),
            typeof convalidaciones === 'string' ? convalidaciones : JSON.stringify(convalidaciones),
            typeof boletasMatricula === 'string' ? boletasMatricula : JSON.stringify(boletasMatricula),
            typeof tcu === 'string' ? tcu : JSON.stringify(tcu),
            typeof historialAcademico === 'string' ? historialAcademico : JSON.stringify(historialAcademico),
            typeof documentacionAdicional === 'string' ? documentacionAdicional : JSON.stringify(documentacionAdicional),
            typeof actasCalificacion === 'string' ? actasCalificacion : JSON.stringify(actasCalificacion),
            studentCondition,
            studentState,
            studentRegistration,
            link,
            subjectCount,
            id,
        ];
        yield connection.query(sql, values);
        yield connection.query(`DELETE FROM user_graduations WHERE uid = ?`, [id]);
        if (Array.isArray(studentGraduations) && studentGraduations.length > 0) {
            const insertValues = [];
            const placeholders = studentGraduations.map(() => '(?, ?, ?)').join(',');
            for (const graduation of studentGraduations) {
                let qualificationsToInsert = null;
                if (graduation.qualifications) {
                    if (typeof graduation.qualifications === 'string') {
                        qualificationsToInsert = graduation.qualifications;
                    }
                    else if (Array.isArray(graduation.qualifications)) {
                        qualificationsToInsert = JSON.stringify(graduation.qualifications);
                    }
                }
                let graduationToInsert = null;
                if (graduation.graduation) {
                    if (typeof graduation.graduation === 'string') {
                        graduationToInsert = graduation.graduation;
                    }
                    else if (Array.isArray(graduation.graduation)) {
                        graduationToInsert = JSON.stringify(graduation.graduation);
                    }
                }
                insertValues.push(id, qualificationsToInsert, graduationToInsert);
            }
            const insertSql = `INSERT INTO user_graduations (uid, qualifications, graduation) VALUES ${placeholders}`;
            yield connection.query(insertSql, insertValues);
        }
        yield connection.commit();
        res.status(200).json({ message: "Expediente actualizado correctamente" });
    }
    catch (error) {
        if (connection)
            yield connection.rollback();
        console.error("Error al actualizar expediente:", error);
        res.status(500).json({ error: "Error al actualizar expediente" });
    }
    finally {
        if (connection)
            connection.release();
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
