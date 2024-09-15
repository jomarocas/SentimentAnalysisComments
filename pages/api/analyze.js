import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { comment } = req.body;

            // Llamada a tu backend en Python para realizar el análisis de sentimiento
            const response = await axios.post('http://localhost:5000/analyze', { comment });
            const { sentiment } = response.data;

            res.status(200).json({ sentiment });
        } catch (error) {
            res.status(500).json({ error: 'Error al analizar el comentario' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
