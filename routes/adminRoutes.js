import express from 'express';
import jwt from 'jsonwebtoken';
import modelAdmin from '../models/modelAdmin.js';
import modelData from '../models/modelData.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';



const router = express.Router();

router.post('/signup', async (req, res) => {
    let user;
    //verifica si el usuario existe
    user = await modelAdmin.findOne({usuario: req.body.usuario});
    if(user) return res.status(400).json({message: "El usuario ya existe en usuarios"});

    //Crear el nuevo usuario
    user = new modelAdmin({
        usuario: req.body.usuario,
        password: req.body.password
    });

    //Guardar el nuevo usuario
    //Controlar los posibles errores
    try{
        await user.save();
        const token = jwt.sign(
            {
                _id: user._id,
                usuario: user.usuario,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            }
        );
        res
        .status(201)
        .header("Authorization", token)
        .json({
            user: {
            message: "Usuario creado correctamente",
            usuario: user.usuario,
            password: user.password,
        },
    token,});
    }catch(error){
        res.status(500).sendStatus("Algo salio mal");
    }
});


router.post("/login", async (req, res) => {
    const user = await modelAdmin.findOne({ usuario: req.body.usuario });
    if (!user) return res.status(400).send("Invalid email or password.");
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");
  
    const token = jwt.sign(
      {
        _id: user._id,
        usuario: user.usuario,
        
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  
    res.status(200).header("Authorization", token).json({token: token});
  });



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
    const tablaId = req.body.tablaId;
    try {
        // Cambia la búsqueda para que sea en columna4
        const data = await modelData.find({ columna4: tablaId });
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
router.get('/borrar-todos', async (req, res) => {
    try {
        // Elimina todos los documentos de la colección modelData
        await modelData.deleteMany({});
        res.status(200).send('Todos los registros han sido eliminados.');
    } catch (err) {
        res.status(500).send('Error al borrar los registros: ' + err);
    }
});


export default router;