import pool from "../bd/connection.js";

export const obtenerCategorias = async (req, res) => {

  try {

    const [categorias] = await pool.query(
`
SELECT *
FROM categorias
WHERE activa = 1
`
);

    res.json({
      ok: true,
      categorias
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};

export const crearCategoria = async (req, res) => {

  try {

    const { nombre, activa } = req.body;

    await pool.query(
      `
      INSERT INTO categorias
      (nombre, activa)
      VALUES (?, ?)
      `,
      [nombre, activa]
    );

    res.json({
      ok: true,
      mensaje: "Categoria creada"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};

export const actualizarCategoria = async (req, res) => {

  try {

    const { id } = req.params;

    const { nombre, activa } = req.body;

    const [result] = await pool.query(
      `
      UPDATE categorias
      SET nombre = ?, activa = ?
      WHERE id = ?
      `,
      [nombre, activa, id]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Categoria no encontrada"
      });

    }

    res.json({
      ok: true,
      mensaje: "Categoria actualizada"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};

export const eliminarCategoria = async (req, res) => {

  try {

    const { id } = req.params;

    // VERIFICAR SI TIENE PRODUCTOS
   const [productos] = await pool.query(
`
SELECT *
FROM productos
WHERE categoria_id = ?
AND activo = 1
`,
[id]
);

    if (productos.length > 0) {

      return res.status(400).json({
        ok: false,
        mensaje: "No se puede eliminar la categoría porque tiene productos asociados"
      });

    }

    const [result] = await pool.query(
`
UPDATE categorias
SET activa = 0
WHERE id = ?
`,
[id]
);

    if (result.affectedRows === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Categoria desactivada"
      });

    }

    res.json({
      ok: true,
      mensaje: "Categoria eliminada"
    });

  } catch (error) {

    console.log("🔥 ERROR DELETE:", error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};

export const obtenerProductosPorCategoria = async (req, res) => {

  try {

    const { id } = req.params;

    const [productos] = await pool.query(
      `
      SELECT *
FROM productos
WHERE categoria_id = ?
AND activo = 1
      `,
      [id]
    );

    res.json({
      ok: true,
      productos
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};