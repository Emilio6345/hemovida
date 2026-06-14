import { Router } from "express";
import pool from "../bd/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// 🔥 TEST
router.get("/test", (req, res) => {
  res.send("API FUNCIONANDO");
});

// 🔥 REGISTRO
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    return res.status(201).json({
      mensaje: "Registro exitoso",
      id: result.insertId
    });

  } catch (error) {
    console.log("🔥 ERROR REGISTRO:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El correo ya existe" });
    }

    return res.status(500).json({ error: "Error en servidor" });
  }
});

// 🔥 LOGIN (SIN ERRORES SILENCIOSOS)
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 BODY LOGIN:", req.body);

    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password requeridos"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Usuario no existe"
      });
    }

    const usuario = rows[0];

    const match = await bcrypt.compare(password, usuario.password);

    const [rows] = await pool.query(
  "SELECT * FROM usuarios WHERE email = ?",
  [email]
);

console.log("USUARIO ENCONTRADO:", rows[0]);

const usuario = rows[0];

const match = await bcrypt.compare(
  password,
  usuario.password
);

console.log("MATCH PASSWORD:", match);

    if (!match) {
      return res.status(401).json({
        error: "Password incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
  mensaje: "Login exitoso",
  token,
  usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  }
});

  } catch (error) {
    console.log("🔥 ERROR LOGIN REAL:", error);
    return res.status(500).json({
      error: error.message
    });
  }
});

// 🔐 MIDDLEWARE TOKEN
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// 🔥 PERFIL (SELECT)
router.get("/perfil", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(rows[0]);

  } catch (error) {
    console.log("🔥 ERROR PERFIL:", error);
    return res.status(500).json({ error: "Error en servidor" });
  }
});

export default router;