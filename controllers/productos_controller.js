// src/controllers/productos_controller.js

import pool from "../bd/connection.js";



// 🔥 GET PRODUCTOS
export const obtenerProductos = async (req, res) => {

  try {

    const [productos] = await pool.query(`
      SELECT *
      FROM productos
      WHERE activo = 1
    `);

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

// 🔥 GET PRODUCTO POR ID
export const obtenerProducto = async (req, res) => {

  try {

    const { id } = req.params;

    const [producto] = await pool.query(
      `
      SELECT *
FROM productos
WHERE id = ?
AND activo = 1
      `,
      [id]
    );

    if (producto.length === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado"
      });

    }

    res.json({
      ok: true,
      producto: producto[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};

// 🔥 CREAR PRODUCTO
export const crearProducto = async (req, res) => {

  try {

    const {

      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen

    } = req.body;

    const sql = `
      INSERT INTO productos
      (
        categoria_id,
        nombre,
        descripcion,
        precio,
        stock,
        imagen
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [

      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen

    ]);

    res.json({
      ok: true,
      mensaje: "Producto creado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};


// 🔥 ACTUALIZAR PRODUCTO
export const actualizarProducto = async (req, res) => {

  try {

    const { id } = req.params;

    const {

      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen

    } = req.body;

    const sql = `
      UPDATE productos
      SET
        categoria_id = ?,
        nombre = ?,
        descripcion = ?,
        precio = ?,
        stock = ?,
        imagen = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [

      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      id

    ]);

    if (result.affectedRows === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado"
      });

    }

    res.json({
      ok: true,
      mensaje: "Producto actualizado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};



// 🔥 DELETE PRODUCTO
export const eliminarProducto = async (req, res) => {

  try {

    const { id } = req.params;

    const [result] = await pool.query(
      `
      UPDATE productos
      SET activo = 0
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado"
      });

    }

    res.json({
      ok: true,
      mensaje: "Producto ocultado correctamente"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      ok: false,
      error: "Error servidor"
    });

  }

};