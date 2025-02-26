import mongoose from 'mongoose';


const DataSchema = new mongoose.Schema({
    columna0: String, // Corresponde a data[i][4]
    columna1: String, // Corresponde a data[i][0]
    columna2: String, // Corresponde a data[i][6]
    columna3: String, // Corresponde a data[i][1]
    columna4: String, // Corresponde a data[i][3]
    columna5: String, // Corresponde a data[i][5]
    estado1: {type: Boolean, default: false},    // Columna adicional para "Estado"
    estado2: {type: Boolean, default: false}, // Columna adicional para "Estado"
    tablaId: String // Identificador único para la tabla
   
  
   
});

const modelData = mongoose.model('data', DataSchema);
export default modelData;