from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# Load the trained model
MODEL_PATH = 'saved_model/plant_disease_model.h5'
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
model = load_model(MODEL_PATH)

# Constants
IMG_SIZE = 128
labels = ['healthy', 'multiple_diseases', 'rust', 'scab']

# Image preprocessing function
def preprocess_image(file):
    try:
        image_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Image decoding failed")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        return np.expand_dims(img, axis=0)
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        return None

# Home route for basic testing
@app.route('/')
def home():
    return "Plant Disease Classification API is running"

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    print("Received a request at /predict")

    if 'image' not in request.files:
        print("No image in request.files")
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    print(f"Received file: {file.filename}")

    image = preprocess_image(file)
    if image is None:
        print("Image preprocessing failed")
        return jsonify({'error': 'Invalid image format'}), 400

    try:
        preds = model.predict(image)[0]
        result = dict(zip(labels, map(float, preds)))
        print(f"Prediction result: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"Prediction failed: {e}")
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
