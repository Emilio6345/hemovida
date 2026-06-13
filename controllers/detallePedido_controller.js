import pool from "../bd/connection.js";


// =========================
// OBTENER DETALLE POR PEDIDO
// =========================
export const obtenerDetallePorPedido = async (req, res) => {
  try {
    const { pedido_id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        dp.id,
        dp.pedido_id,
        dp.producto_id,
        dp.precio_unitario,
        dp.cantidad,
        (dp.precio_unitario * dp.cantidad) AS subtotal
      FROM detalle_pedido dp
      WHERE dp.pedido_id = ?
      `,
      [pedido_id]
    );

    res.json({
      ok: true,
      detalle: rows
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Error al obtener detalle del pedido"
    });
  }
};