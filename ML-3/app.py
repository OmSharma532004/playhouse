from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('svm_model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/')
def home():
    return 'Irrigation Prediction API is running'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Request must contain \"features\"'}), 400

    try:
        features = np.array(data['features']).reshape(1, -1)
        scaled = scaler.transform(features)
        prediction = model.predict(scaled)[0]
        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
