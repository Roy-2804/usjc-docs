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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, role } = req.query;
    let sql = "SELECT * FROM users WHERE 1 = 1";
    const values = [];
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
        const [rows] = yield db_1.pool.query(sql, values);
        res.json(rows);
    }
    catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
}));
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield db_1.pool.query(`SELECT * FROM users WHERE id=${id}`);
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error al obtener usuario:", err);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
}));
router.post("/new-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, pass, role } = req.body.data;
    try {
        const [existing] = yield db_1.pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "El correo ya está registrado." });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(pass, 10);
        const sql = `INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())`;
        yield db_1.pool.query(sql, [name, email, hashedPassword, role]);
        res.status(201).json({ message: "Usuario creado exitosamente." });
    }
    catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}));
router.put("/update/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, pass, role } = req.body.data;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token no proporcionado" });
    try {
        let hashedPassword = pass;
        const saltRounds = 10;
        hashedPassword = yield bcryptjs_1.default.hash(pass, saltRounds);
        const sql = `UPDATE users SET
      name = ?, email = ?, password = ?, role = ?
      WHERE id = ?`;
        const values = [
            name,
            email,
            hashedPassword,
            role,
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
router.delete("/delete/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield db_1.pool.query("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar Usuario:", error);
        res.status(500).json({ message: "Error al eliminar Usuario" });
    }
}));
exports.default = router;
