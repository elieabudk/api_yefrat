import "dotenv/config"
import app from "./app.js"

// debemos usar dotenv para acceder a las variables de entorno

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Entorno actual: ${process.env.NODE_ENV}`)
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
})

export default server
