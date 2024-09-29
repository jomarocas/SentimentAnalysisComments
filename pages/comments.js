import { useState, useEffect } from 'react';

export default function Comments() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch('/api/comments');
            const data = await res.json();
            setComments(data.comments);
        };
        fetchComments();
    }, []);

    return (
        <div>
            <h1>Comentarios Analizados</h1>
            <ul>
                {comments.map(comment => (
                    <li key={comment._id}>
                        <p><strong>Comentario:</strong> {comment.comentario}</p>
                        <p><strong>Sentimiento:</strong> {comment.sentimiento}</p>
                        <p><strong>Fecha:</strong> {new Date(comment.fecha).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
