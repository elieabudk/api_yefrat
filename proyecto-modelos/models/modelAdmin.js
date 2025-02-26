import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; //instalada con npm install uuidv4
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema(
    {
    id: {type: String, default: uuidv4, required: true},
    usuario: {type: String, required: true},
    password: {type: String, required: true},
   
});
//Pre salvado para que el modelo se encargue de hashear la contraseña

adminSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const modelAdmin = mongoose.model('admin', adminSchema);
export default modelAdmin;
