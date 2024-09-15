import { useState } from 'react';
import axios from 'axios';
import SentimentChart from '../components/SentimentChart';

export default function Home() {
    const [comment, setComment] = useState('');
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        try {
            const response = await axios.post('/api/analyze', { comment });
            setResult(response.data.sentiment);
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
        }
    };

    return (
        <div>
            <h1>Análisis de Sentimiento de Comentarios</h1>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario aquí..."
            />
            <button onClick={handleAnalyze}>Analizar Sentimiento</button>

            {result && (
                <div>
                    <h2>Resultado del Sentimiento: {result}</h2>
                    <SentimentChart sentiment={result} />
                </div>
            )}
        </div>
    );
}
