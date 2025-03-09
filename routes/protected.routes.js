import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import modelAdmin from "../models/modelAdmin.js";

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await modelAdmin.findById(req.user.id);
    res.json({ message: "Bienvenido a tu perfil", usuario: user.usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error });
  }
});

export default router;