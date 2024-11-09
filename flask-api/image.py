from curses.panel import new_panel
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import numpy as np
import io
from PIL import Image


# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app, origins='*')  # Replace with specific domain if possible

with open('xray_dehaze_model.pkl', 'wb') as file:
    pickle.dump(new_panel, file)

# Define an endpoint to process the image
@app.route('/process_image', methods=['POST'])
def process_image():
    with open('image.pkl', 'rb') as file:
        model = pickle.load(file)
    if 'image' not in request.files:
        return jsonify({"error": "No image file found in the request"}), 400
    
    try:
        # Read image file from the request
        file = request.files['image']
        image = Image.open(file).convert('L')  # Convert to grayscale

        # Convert image to numpy array for processing
        image_np = np.array(image)

        # Process the image with the loaded model
        processed_image_np = model.process_image(image_np)
        
        # Convert processed image back to PIL format
        processed_image = Image.fromarray(processed_image_np)

        # Convert PIL image to binary stream for sending as a response
        img_io = io.BytesIO()
        processed_image.save(img_io, 'JPEG')
        img_io.seek(0)

        return send_file(img_io, mimetype='image/jpeg')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=7000)
