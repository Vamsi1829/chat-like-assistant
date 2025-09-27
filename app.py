from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env
load_dotenv()

# Flask setup
app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Initialize Gemini 1.5 Flash model
try:
    model = genai.GenerativeModel('models/gemini-1.5-flash-latest')
except Exception as e:
    print(f"Model initialization error: {e}")
    model = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def generate_response():
    if not model:
        return jsonify({'error': 'Model not initialized'}), 500

    data = request.get_json()
    prompt = data.get('prompt', '').strip()

    print(f"Received prompt: {prompt}")  # Debug log

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        print(f"Error during generation: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
