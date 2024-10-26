import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
    const [url, setUrl] = useState('');
    const [comments, setComments] = useState('');
    const [result, setResult] = useState(null);
    const [newsId, setNewsId] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/comments', { url, comments });
            setResult(response.data);

            // Obtener el ID de la noticia a partir de la URL
            const idMatch = url.match(/#(\d+)/);
            if (idMatch) {
                setNewsId(idMatch[1]); // Guardar el ID en el estado
            } else {
                setNewsId(''); // Restablecer si no se encuentra el ID
            }
        } catch (error) {
            console.error('Error procesando los comentarios:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
                Administrador de Comentarios
            </h1>
            <form className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <label className="block mb-2 text-lg font-medium text-gray-700">URL de la noticia</label>
                <input
                    type="text"
                    className="w-full p-4 border rounded-lg mb-4"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Ingresa la URL de la noticia"
                />
                <label className="block mb-2 text-lg font-medium text-gray-700">Comentarios (uno por línea)</label>
                <textarea
                    className="w-full p-4 border rounded-lg"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Pega todos los comentarios aquí, uno por línea..."
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 mt-4 rounded-lg hover:bg-blue-600 transition"
                >
                    Procesar Comentarios
                </button>
            </form>

            {result && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Resultados:</h2>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                    {/* Enlace a la página de sentimiento */}
                    {newsId && (
                        <a
                            href={`/sentiment/${newsId}`}
                            className="text-blue-600 hover:underline mt-4 inline-block"
                        >
                            Ver análisis de sentimiento
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
