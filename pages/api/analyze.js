import axios from 'axios';
import dbConnect from '../../lib/db';
import Comentario from '../../models/Comentario';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await dbConnect();

        try {
            const { comment } = req.body;

            // Llamada a tu backend de Python para analizar el comentario
            const response = await axios.post('http://localhost:5000/analyze', { comment });
            const { sentiment } = response.data;

            // Guardar el comentario y el resultado en MongoDB
            const newComment = new Comentario({
                comentario: comment,
                sentimiento: sentiment,
            });

            const savedComment = await newComment.save();

            res.status(200).json({ sentiment, data: savedComment });
        } catch (error) {
            res.status(500).json({ error: 'Error al analizar el comentario o guardar en la base de datos' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
