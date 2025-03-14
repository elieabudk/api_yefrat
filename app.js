import "dotenv/config"
import express from "express"
import morgan from "morgan"
import mongoose from "mongoose"
import userRoutes from "./routes/adminRoutes.js"
import cors from "cors"
import protectedRoutes from "./routes/protected.routes.js";


//import ticketRoutes from "./routes/ticket.routes.js"

const app = express()




// url de la base de datos
const DB_URL= process.env.NODE_ENV === "dev" //verifica si estamos ejecutando npm run dev o npm start
? 'mongodb://localhost:27017/test' //si es true este se ejecuta
: process.env.DB_URL || "mongodb://localhost:27017/test_dataset"; //npm start 



// conectar a la base de datos
mongoose.connect(DB_URL)
.then(() => {
    console.log(`Conectado a la base de datos: ${DB_URL}`)
})
.catch((err) => {
    console.log("Error al conectar a la base de datos", err)
})


// middleware

app.use(express.json()) // para que express pueda entender el json
app.use(morgan("combined")) // para que express pueda entender el morgan y ver los datos de las peticiones
app.use(cors({
    origin: [
       
        "https://spontaneous-torrone-6da1a7.netlify.app",
        
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,
}));





app.get("/", (req, res) => {
    res.send("hola, node js")
})


app.get("/inicio", (req, res) => {
    res.send("hola, node js, estamos en la ruta inicio")
})


// rutas
app.use("/api/users", userRoutes)
app.use("/api/protected", protectedRoutes);
//app.use("/api/tickets", ticketRoutes)



export default app







