from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.json
    comment = data.get('comment', '')

    # Usamos TextBlob para analizar el sentimiento del comentario
    analysis = TextBlob(comment)
    sentiment = analysis.sentiment.polarity

    # Clasificamos el sentimiento en positivo, negativo o neutral
    if sentiment > 0:
        result = 'positivo'
    elif sentiment < 0:
        result = 'negativo'
    else:
        result = 'neutral'

    return jsonify({'sentiment': result})

if __name__ == '__main__':
    app.run(debug=True)
