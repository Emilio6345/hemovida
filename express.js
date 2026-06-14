import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import productoRoutes from "./routes/producto.js";
import categoriaRoutes from "./routes/categoria.js";
import pedidoRoutes from "./routes/pedido.js";
import botRoutes from "./routes/bot.js";

console.log("GROQ:", !!process.env.GROQ_API_KEY);

const app = express();

const PORT = process.env.PORT || 3000;


// =========================
// CONFIGURACIÓN CORS
// =========================

app.use(cors({

  origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hemovida-frontend.vercel.app",
  "https://hemovida-frontend-clx1ugium-emilio-lopez-projects.vercel.app"
],
    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]

}));



// =========================
// MIDDLEWARES
// =========================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



// =========================
// RUTA PRINCIPAL
// =========================

app.get("/", (req, res) => {

    res.send("Servidor funcionando");

});



// =========================
// RUTAS API
// =========================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/productos", productoRoutes);

app.use("/api/v1/categorias", categoriaRoutes);

app.use("/api/v1/pedidos", pedidoRoutes);

app.use("/api/v1/bot", botRoutes);




// =========================
// MANEJO GLOBAL ERRORES
// =========================

app.use((err, req, res, next) => {

    console.error("🔥 ERROR:", err);

    res.status(500).json({

        ok: false,

        error: err.message

    });

});



// =========================
// INICIAR SERVIDOR
// =========================

app.listen(PORT, () => {

    console.log(
        `🔥 Servidor corriendo en http://localhost:${PORT}`
    );

});