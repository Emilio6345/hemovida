import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './bd/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 FORZAMOS lectura del .env dentro de src
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);

async function probarConexion() {
    try {
        console.log("Intento de conexión a MySQL");

        const connection = await pool.getConnection();

        console.log("Conexión exitosa");

        connection.release();

    } catch (error) {
        console.log("Error al conectar con la base de datos");
        console.log(error.message);
    }
}

probarConexion();