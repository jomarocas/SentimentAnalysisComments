from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
from pymongo import MongoClient
from bs4 import BeautifulSoup
import requests
import re
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Configuración de MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['eltiempo_comments']
news_collection = db['news']

# Inicializar Flask
app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Inicializar el analizador de VADER
analyzer = SentimentIntensityAnalyzer()

# Función para hacer scraping de la noticia
def scrape_news_data(news_url):
    try:
        # Hacer la solicitud a la página
        response = requests.get(news_url)
        if response.status_code != 200:
            return None, f"Error: {response.status_code}"

        # Parsear el contenido HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extraer título
        title = soup.find('h1').get_text(strip=True) if soup.find('h1') else "Sin título"
        
        # Extraer lead desde og:description
        lead = soup.find('meta', property='og:description')
        lead = lead['content'].strip() if lead and 'content' in lead.attrs else "Sin lead"
        
        # Extraer ID de la URL (ignorar el símbolo #)
        news_id_match = re.search(r'-(\d+)(?:#|$)', news_url)
        news_id = news_id_match.group(1) if news_id_match else "ID no encontrado"

        return {
            'title': title,
            'lead': lead,
            'url': news_url,
            'id': news_id
        }, None
    except Exception as e:
        return None, str(e)

# Función para procesar los comentarios pegados manualmente
def process_comments(raw_comments):
    processed_comments = []
    current_author = "Anonymous"  # Valor por defecto si no hay autor
    current_date = "Sin fecha"    # Valor por defecto si no hay fecha

    lines = raw_comments.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('Comentario de'):  # Capturamos el autor
            current_author = line.replace('Comentario de', '').strip('. ')
        elif line.startswith('Hace'):  # Capturamos la fecha
            current_date = line
        elif line:  # El resto es contenido del comentario
            processed_comments.append({
                'author': current_author,
                'date': current_date,
                'content': line
            })
            current_author = "Anonymous"  # Restablecemos los valores por defecto
            current_date = "Sin fecha"
    
    return processed_comments

# Función para analizar el sentimiento de un comentario usando VADER
def analyze_sentiment(comment):
    score = analyzer.polarity_scores(comment)
    if score['compound'] >= 0.05:
        return 'positivo'
    elif score['compound'] <= -0.05:
        return 'negativo'
    else:
        return 'neutral'

# Función para determinar si la noticia es de política
def is_political_news(title, lead):
    keywords = ['política', 'gobierno', 'elecciones', 'congreso', 'partidos']
    combined_text = f"{title.lower()} {lead.lower()}"
    return any(keyword in combined_text for keyword in keywords)

# Ruta para recibir la URL de la noticia y los comentarios
@app.route('/comments', methods=['POST'])
def add_comments():
    data = request.json
    news_url = data.get('url')
    raw_comments = data.get('comments')

    if not news_url or not raw_comments:
        return jsonify({'message': 'URL de la noticia y comentarios son requeridos'}), 400

    # Realizar el scraping de la noticia
    news_data, error = scrape_news_data(news_url)
    if error:
        return jsonify({'message': f'Error al obtener la noticia: {error}'}), 500

    # Procesar los comentarios pegados manualmente
    processed_comments = process_comments(raw_comments)

    # Analizar el sentimiento de cada comentario y agregarlo a los comentarios procesados
    for comment in processed_comments:
        comment['sentiment'] = analyze_sentiment(comment['content'])

    # Determinar si la noticia es de política
    news_data['is_political'] = is_political_news(news_data['title'], news_data['lead'])

    # Guardar los datos de la noticia y los comentarios en MongoDB
    news_collection.insert_one({
        'news_data': news_data,
        'comments': processed_comments
    })

    return jsonify({'message': 'Noticia y comentarios guardados con éxito'}), 201

# Ruta para obtener la noticia y los comentarios por ID
@app.route('/comments/id/<string:news_id>', methods=['GET'])
def get_comments_by_id(news_id):
    news_data = news_collection.find_one({'news_data.id': news_id})
    if not news_data:
        return jsonify({'message': 'No se encontraron datos para este ID'}), 404
    
    return jsonify(news_data), 200

# Ruta para borrar la noticia y comentarios por ID
@app.route('/comments/id/<string:news_id>', methods=['DELETE'])
def delete_comments_by_id(news_id):
    result = news_collection.delete_one({'news_data.id': news_id})
    
    if result.deleted_count == 0:
        return jsonify({'message': 'No se encontraron datos para borrar este ID'}), 404
    
    return jsonify({'message': 'Noticia y comentarios borrados con éxito'}), 204

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
