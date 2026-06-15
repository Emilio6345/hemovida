import { Router } from "express";

import {
  obtenerPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
  obtenerDetallePorPedido
} from "../controllers/pedidos_controller.js";

import { validarCampos } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// =========================
// PEDIDOS
// =========================
router.get("/", obtenerPedidos);

// DETALLE DEL PEDIDO
router.get("/detalle/:pedido_id", obtenerDetallePorPedido);

// =========================
// CRUD
// =========================
router.post(
  "/",
  verifyToken,
  validarCampos([
    "usuario_id",
    "total",
    "estado",
    "carrito"
  ]),
  crearPedido
);

router.put(
  "/:id",
  validarCampos(["usuario_id", "total", "estado"]),
  actualizarPedido
);

router.delete("/:id", eliminarPedido);

export default router;