import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (requireAdmin = false) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header:", authHeader); // Log do cabeçalho de autorização
  
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (requireAdmin && !decoded.isadmin) {
      return res.status(403).json({ error: "Acesso negado: somente administradores" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
