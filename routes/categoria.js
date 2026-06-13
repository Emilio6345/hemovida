// src/routes/categoria.js

import { Router } from "express";

import {

  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerProductosPorCategoria

} from "../controllers/categorias_controller.js";

import { validarCampos } from "../middlewares/avanzado.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

console.log("🔥 categoria.js cargado");

// 🔥 GET CATEGORIAS
router.get(
  "/",
  obtenerCategorias
);



// 🔥 POST CATEGORIA
router.post(
  "/",
  verifyToken,
  validarCampos([
    "nombre",
    "activa"
  ]),
  crearCategoria
);



// 🔥 PUT CATEGORIA
router.put(
  "/:id",
  verifyToken,
  validarCampos([
    "nombre",
    "activa"
  ]),
  actualizarCategoria
);



// 🔥 DELETE CATEGORIA
router.delete(
  "/:id",
  verifyToken,
  eliminarCategoria
);

router.get(
  "/:id/productos",
  obtenerProductosPorCategoria
);  

export default router;