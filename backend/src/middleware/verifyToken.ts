import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  email: string;
  name?: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No autorizado. Token no proporcionado." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};
