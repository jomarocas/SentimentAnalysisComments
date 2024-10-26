import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/router';

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentDashboard = () => {
    const router = useRouter();
    const { id: newsId } = router.query;

    const [commentsData, setCommentsData] = useState({
        title: '',  // Título de la noticia
        lead: '',   // Lead de la noticia
        category: '', // Categoría de la noticia
        overallSentiment: 0,
        totalComments: 0,
        uniqueUsers: 0,
        sentimentBreakdown: {
            positive: 0,
            neutral: 0,
            negative: 0,
        },
        comments: []  // Almacenar los comentarios
    });

    useEffect(() => {
        if (newsId) {
            const fetchSentimentData = async (newsId) => {
                try {
                    const response = await fetch(`http://localhost:8000/comments/stats/${newsId}`);
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de sentimientos');
                    }
                    const data = await response.json();

                    setCommentsData({
                        title: data.title, // Establecer el título
                        lead: data.lead,   // Establecer el lead
                        category: data.category, // Establecer la categoría
                        overallSentiment: data.overallSentiment,
                        totalComments: data.totalComments,
                        uniqueUsers: data.uniqueUsers,
                        sentimentBreakdown: {
                            positive: data.sentimentBreakdown.positive,
                            neutral: data.sentimentBreakdown.neutral,
                            negative: data.sentimentBreakdown.negative,
                        },
                        comments: data.comments // Guardar los comentarios
                    });
                } catch (error) {
                    console.error(error);
                }
            };

            fetchSentimentData(newsId);
        }
    }, [newsId]);

    const sentimentBreakdownData = {
        labels: ['Positivo', 'Neutral', 'Negativo'],
        datasets: [
            {
                data: [
                    commentsData.sentimentBreakdown.positive,
                    commentsData.sentimentBreakdown.neutral,
                    commentsData.sentimentBreakdown.negative,
                ],
                backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'],
            },
        ],
    };

    // Calcular el porcentaje de cada tipo de sentimiento
    const totalSentiments = commentsData.sentimentBreakdown.positive +
        commentsData.sentimentBreakdown.neutral +
        commentsData.sentimentBreakdown.negative;

    const positivePercentage = totalSentiments > 0 ? (commentsData.sentimentBreakdown.positive / totalSentiments * 100).toFixed(2) : 0;
    const neutralPercentage = totalSentiments > 0 ? (commentsData.sentimentBreakdown.neutral / totalSentiments * 100).toFixed(2) : 0;
    const negativePercentage = totalSentiments > 0 ? (commentsData.sentimentBreakdown.negative / totalSentiments * 100).toFixed(2) : 0;

    // Función para obtener el emoji según el tipo de sentimiento
    const getArrow = (type) => {
        switch (type) {
            case 'positive':
                return '👍'; // Manita arriba para positivo
            case 'neutral':
                return '👉'; // Manita señalando para neutral
            case 'negative':
                return '👎'; // Manita abajo para negativo
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-5xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Análisis de Sentimiento</h1>

                    {/* Mostrar el título, el lead y la categoría */}
                    <div className="text-left mb-6">
                        <h2 className="text-xl font-bold text-gray-700">{commentsData.title}</h2>
                        <p className="text-gray-600">{commentsData.lead}</p>
                        <p className="text-gray-500 italic">Categoría de la noticia: {commentsData.category || "No disponible"}</p> {/* Mostrar la categoría */}
                    </div>

                    <div className="flex justify-around items-center">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Nivel general de sentimiento</p>
                            <p className="text-3xl font-bold text-green-500">
                                {commentsData.overallSentiment.toFixed(2)} de 5
                            </p>
                            <p className={commentsData.overallSentiment >= 3 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                                {commentsData.overallSentiment >= 3 ? "Positivo" : "Negativo"}
                            </p>
                        </div>

                        <div className="w-48">
                            <Doughnut data={sentimentBreakdownData} />
                            <p className="text-center mt-2 text-sm text-gray-600">Desglose del sentimiento</p>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">Comentarios totales</p>
                            <p className="text-2xl font-bold text-gray-800">{commentsData.totalComments}</p>
                            <p className="text-sm text-gray-600">Usuarios únicos</p>
                            <p className="text-2xl font-bold text-gray-800">{commentsData.uniqueUsers}</p>
                            <div className="mt-4">
                                <p>Positivo: {positivePercentage}% {getArrow('positive')}</p>
                                <p>Neutral: {neutralPercentage}% {getArrow('neutral')}</p>
                                <p>Negativo: {negativePercentage}% {getArrow('negative')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mostrar los comentarios */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Comentarios</h3>
                        {commentsData.comments.length > 0 ? (
                            <ul className="space-y-4">
                                {commentsData.comments.map((comment, index) => (
                                    <li key={index} className="p-4 bg-gray-100 rounded-md shadow">
                                        <p className="text-sm text-gray-800"><strong>Usuario:</strong> {comment.author || "Anónimo"}</p>
                                        <p className="text-sm text-gray-800"><strong>Comentario:</strong> {comment.content || "Comentario no disponible"}</p>  {/* Mostrar el comentario */}
                                        <p className="text-sm text-gray-500"><strong>Sentimiento:</strong> {comment.sentiment}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No hay comentarios disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentimentDashboard;
