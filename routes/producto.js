// src/routes/producto.js

import { Router } from "express";

import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productos_controller.js";

import { validarCampos } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();


// 🔥 GET PRODUCTOS
router.get(
  "/",
  obtenerProductos
);

router.get(
  "/:id",
  obtenerProducto
);

// 🔥 POST PRODUCTOS
router.post(
  "/",
  verifyToken,
  validarCampos([
    "categoria_id",
    "nombre",
    "descripcion",
    "precio",
    "stock"
  ]),
  crearProducto
);


// 🔥 PUT PRODUCTO (ACTUALIZAR)
router.put(
  "/:id",
  verifyToken,
  validarCampos([
    "categoria_id",
    "nombre",
    "descripcion",
    "precio",
    "stock"
  ]),
  actualizarProducto
);


// 🔥 DESACTIVAR PRODUCTO (SOFT DELETE)
router.put(
  "/desactivar/:id",
  verifyToken,
  eliminarProducto
);


// 🔥 DELETE PRODUCTO (BORRADO DEFINITIVO LOGICO)
router.delete(
  "/:id",
  verifyToken,
  eliminarProducto
);


export default router;  