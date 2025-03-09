import modelAdmin from "../models/modelAdmin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Validar que usuario y password no estén vacíos
    if (!usuario || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }

    // Validar longitud mínima
    if (usuario.length < 3 || password.length < 6) {
      return res.status(400).json({ message: "Usuario debe tener al menos 3 caracteres y contraseña al menos 6 caracteres" });
    }

    // Validar que solo contengan caracteres alfanuméricos
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(usuario) || !alphanumericRegex.test(password)) {
      return res.status(400).json({ message: "Usuario y contraseña solo pueden contener letras y números" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await modelAdmin.findOne({ usuario });
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new modelAdmin({ usuario, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};





export const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Validar que usuario y password no estén vacíos
    if (!usuario || !password) {
        return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
      }
  
      // Validar longitud mínima
      if (usuario.length < 3 || password.length < 6) {
        return res.status(400).json({ message: "Usuario debe tener al menos 3 caracteres y contraseña al menos 6 caracteres" });
      }
  
      // Validar que solo contengan caracteres alfanuméricos
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if (!alphanumericRegex.test(usuario) || !alphanumericRegex.test(password)) {
        return res.status(400).json({ message: "Usuario y contraseña solo pueden contener letras y números" });
      }


    // Buscar usuario por usuario
    const user = await modelAdmin.findOne({ usuario });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(200).json({ token, user: { id: user._id, usuario: user.usuario } });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

