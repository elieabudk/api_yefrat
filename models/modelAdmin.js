import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; //instalada con npm install uuidv4


const adminSchema = new mongoose.Schema(
    {
    id: {type: String, default: uuidv4, required: true},
    usuario: {type: String, required: true},
    password: {type: String, required: true},
   
});


const modelAdmin = mongoose.model('admin', adminSchema);
export default modelAdmin;
