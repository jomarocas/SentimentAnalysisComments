// models/Comentario.js
import mongoose from 'mongoose';

const ComentarioSchema = new mongoose.Schema({
    comentario: {
        type: String,
        required: true,
    },
    sentimiento: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Comentario || mongoose.model('Comentario', ComentarioSchema);
