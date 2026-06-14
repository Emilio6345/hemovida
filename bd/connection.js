import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 TU .env ESTÁ EN src/, entonces es ../.env
const envPath = path.resolve(__dirname, "../.env");

// cargar variables
dotenv.config();

// DEBUG
console.log("📌 ENV PATH:", envPath);
console.log("📌 DB_HOST:", process.env.DB_HOST);
console.log("📌 DB_PORT:", process.env.DB_PORT);
console.log("📌 DB_USER:", process.env.DB_USER);
console.log("📌 DB_NAME:", process.env.DB_NAME);

// si no carga, frena aquí
if (!process.env.DB_USER) {
  throw new Error("❌ No se está leyendo el .env (revisa ruta o archivo)");
}

// pool de conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log("✅ CONECTADO A RAILWAY");
    conn.release();
  })
  .catch(err => {
    console.log("❌ ERROR MYSQL:", err);
  });
  
export default pool;