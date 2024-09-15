import { Pie } from 'react-chartjs-2';

export default function SentimentChart({ sentiment }) {
    const data = {
        labels: ['Positivo', 'Neutral', 'Negativo'],
        datasets: [
            {
                label: 'Distribución de Sentimiento',
                data: [
                    sentiment === 'positivo' ? 1 : 0,
                    sentiment === 'neutral' ? 1 : 0,
                    sentiment === 'negativo' ? 1 : 0
                ],
                backgroundColor: ['#4caf50', '#ffeb3b', '#f44336']
            }
        ]
    };

    return <Pie data={data} />;
}
