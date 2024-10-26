import { useState } from 'react';
import { useRouter } from 'next/router';

const SentimentForm = () => {
    const [newsId, setNewsId] = useState('');
    const router = useRouter();

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newsId.trim()) {
            // Redirige a la página del ID de la noticia
            router.push(`/sentiment/${newsId}`);
        } else {
            alert('Por favor, ingresa un ID de noticia válido.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Análisis de Sentimiento</h1>
                <p className="text-gray-600 text-center mb-6">Ingresa el ID de la noticia para analizar sus comentarios</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newsId" className="block text-sm font-medium text-gray-700">ID de la Noticia</label>
                        <input
                            type="text"
                            id="newsId"
                            value={newsId}
                            onChange={(e) => setNewsId(e.target.value)}
                            placeholder="Ingrese el ID de la noticia"
                            className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Analizar Sentimiento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SentimentForm;
