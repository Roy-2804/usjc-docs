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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const [rows] = yield db_1.pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0)
            return res.status(401).json({ error: "Usuario no encontrado" });
        const user = rows[0];
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Contraseña incorrecta" });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                name: user.name
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}));
router.get("/profile", verifyToken_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const [rows] = yield db_1.pool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [user.id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });
        return res.json(rows[0]);
    }
    catch (error) {
        return res.status(500).json({ message: "Error al obtener perfil", error });
    }
}));
exports.default = router;
