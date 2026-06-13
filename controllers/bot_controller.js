import axios from "axios";
import pool from "../bd/connection.js";

console.log(
  "GROQ cargada:",
  !!process.env.GROQ_API_KEY
);

export const consultarBot = async (req, res) => {
  try {

    const { pregunta } = req.body;

    if (!pregunta) {
      return res.json({
        respuesta: "Escribe una pregunta"
      });
    }

    console.log("🔥 PREGUNTA:", pregunta);

    const [rows] = await pool.query(`
      SELECT
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        c.nombre AS categoria
      FROM productos p
      JOIN categorias c
      ON p.categoria_id = c.id
    `);

    const catalogoTexto = rows
      .map(
        p => `
Producto: ${p.nombre}
Descripción: ${p.descripcion}
Precio: $${p.precio}
Stock: ${p.stock}
Categoría: ${p.categoria}
`
      )
      .join("\n-----------------\n");

    const prompt = `
Eres un asistente virtual de ecommerce.

REGLAS:
1. Responde usando el catálogo.
2. Recomienda productos.
3. Sé amable.

CATÁLOGO:

${catalogoTexto}

PREGUNTA:

${pregunta}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const respuesta =
      response.data.choices[0].message.content;

    return res.json({
      respuesta
    });

  } catch(error){

    console.log(
      error.response?.data || error
    );

    return res.status(500).json({
      respuesta:
      error.response?.data?.error?.message ||
      error.message
    });

  }
};