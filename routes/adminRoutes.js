import express from 'express';
import jwt from 'jsonwebtoken';
import modelAdmin from '../models/modelAdmin.js';
import modelData from '../models/modelData.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { register, login } from '../controllers/auth.controller.js';



const router = express.Router();

router.post("/register", register);
router.post("/login", login);


  // Nueva ruta para subir a la base de datos
router.post('/guardar-datos', async (req, res) => {
    console.log(req.body); // Verifica los datos recibidos
    const dataFila = req.body;

    const newData =  new modelData({
       ...dataFila,
       
    });

    try{
        await newData.save();
        res.status(201).send('Data saved');
    }catch(err){
        res.status(500).send('Error saving data: ' + err);
    }

       
});

// Nueva ruta para mostrar datos a partir de el tabla id    
router.post('/mostrar-datos', async (req, res) => {
    const columna4 = req.body.columna4;
    const tablaId = req.body.tablaId;
    try {
        // Cambia la búsqueda para que sea en columna4
        const data = await modelData.find({ columna4: columna4, tablaId: tablaId });
        res.json(data);
    } catch (err) {
        res.status(500).send('Error fetching data: ' + err);
    }
});

router.get('/mostrar-todo', async (req, res) => {
    try {
        const data = await modelData.find();
        res.json(data);
    } catch (err) {
        res.status(500).send('Error fetching data: ' + err);
    }
});

//routa para editar la columna del estado tomando id la columna 3

router.post('/editar-estado/', async (req, res) => {
    const columna3 = req.body.columna3;
    const estado = req.body.estado;

    try {
        const data = await modelData.findOneAndUpdate(
            { columna3: columna3 },
            { estado1: estado },
            { new: true }
        );

        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No se encontró el registro con la columna3 proporcionada.');
        }
    } catch (err) {
        res.status(500).send('Error actualizando el estado: ' + err);
    }
});



router.post('/editar-estado2/', async (req, res) => {
    const columna3 = req.body.columna3;
    const estado = req.body.estado;

    try {
        const data = await modelData.findOneAndUpdate(
            { columna3: columna3 },
            { estado2: estado },
            { new: true }
        );

        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No se encontró el registro con la columna3 proporcionada.');
        }
    } catch (err) {
        res.status(500).send('Error actualizando el estado: ' + err);
    }
});

// ruta para borrar todos los datos
router.post('/borrar-todos-empresas', async (req, res) => {
    const tablaId = req.body.tablaId;
    try {
        // Elimina todos los documentos de la colección modelData
        await modelData.deleteMany({ tablaId: tablaId });
        res.status(200).send('Todos los registros han sido eliminados.');
    } catch (err) {
        res.status(500).send('Error al borrar los registros: ' + err);
    }
});


//ruta para mostrar los datos de las empresas

router.post('/mostrar-datos-empresas', async (req, res) => {
    const tablaId = req.body.tablaId;
    
    if (!tablaId) {
        return res.status(400).send('El tablaId es requerido');
    }

    try {
        const data = await modelData.find({ tablaId: tablaId });
        
        if (data.length === 0) {
            return res.status(404).send('No se encontraron datos para el tablaId proporcionado');
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).send('Error fetching data: ' + err);
    }
});


export default router;