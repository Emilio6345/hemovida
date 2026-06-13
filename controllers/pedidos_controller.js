import pool from "../bd/connection.js";

console.log("🔥 CONTROLLER PEDIDOS CARGADO");

// =========================
// GET PEDIDOS
// =========================
export const obtenerPedidos = async (req, res) => {

  try {

    let pedidos = [];

    if (req.usuario.rol === "ADMIN") {

  const [rows] = await pool.query(`
SELECT
  p.*,
  u.nombre,
  u.email
FROM pedidos p
INNER JOIN usuarios u
ON u.id = p.usuario_id
WHERE p.activo = 1
ORDER BY p.id DESC
`);

  pedidos = rows;

} else {

  const [rows] = await pool.query(
`
SELECT
  p.*,
  u.nombre,
  u.email
FROM pedidos p
INNER JOIN usuarios u
ON u.id = p.usuario_id
WHERE p.usuario_id = ?
AND p.activo = 1
ORDER BY p.id DESC
`,
[req.usuario.id]
);

      pedidos = rows;
    }

    return res.json({
      ok: true,
      pedidos
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }
};

// =========================
// GET DETALLE PEDIDO
// =========================
export const obtenerDetallePorPedido = async (req, res) => {
  console.log("🔥 ENTRÓ A GET DETALLE");

  try {
    const { pedido_id } = req.params;

    const [detalle] = await pool.query(
      `
      SELECT 
        dp.id,
        dp.pedido_id,
        dp.producto_id,
        p.nombre,
        dp.cantidad,
        dp.precio_unitario,
        (dp.precio_unitario * dp.cantidad) AS subtotal
      FROM detalle_pedido dp
      INNER JOIN productos p ON p.id = dp.producto_id
      WHERE dp.pedido_id = ?
      `,
      [pedido_id]
    );

    return res.json({
      ok: true,
      detalle
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

// =========================
// CREAR PEDIDO
// =========================
export const crearPedido = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { usuario_id, total, estado, carrito } = req.body;

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)`,
      [usuario_id, total, estado]
    );

    const pedidoId = pedidoResult.insertId;

    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío");
    }

    for (const item of carrito) {
      await connection.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, precio_unitario, cantidad)
         VALUES (?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.precio_unitario, item.cantidad]
      );
    }

    await connection.commit();

    return res.json({
      ok: true,
      mensaje: "Pedido creado correctamente",
      pedidoId
    });

  } catch (error) {
    await connection.rollback();

    return res.status(500).json({
      ok: false,
      error: error.message,
      sqlMessage: error.sqlMessage
    });

  } finally {
    connection.release();
  }
};

// =========================
// ACTUALIZAR PEDIDO
// =========================
export const actualizarPedido = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { usuario_id, total, estado } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        error: "ID inválido"
      });
    }

    await pool.query(
      `UPDATE pedidos SET usuario_id=?, total=?, estado=? WHERE id=?`,
      [usuario_id, total, estado, id]
    );

    return res.json({
      ok: true,
      mensaje: "Pedido actualizado correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

// =========================
// ELIMINAR PEDIDO
// =========================
export const eliminarPedido = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        error: "ID inválido"
      });
    }

    const [result] = await pool.query(
  `
  UPDATE pedidos
  SET activo = 0
  WHERE id = ?
  `,
  [id]
);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Pedido no encontrado"
      });
    }

    return res.json({
      ok: true,
      mensaje: "Pedido desactivado correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};