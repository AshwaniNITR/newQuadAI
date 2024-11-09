import cv2
import numpy as np
import pickle
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
from PIL import Image

# Define the class with the original name `CLAHEModel`
class CLAHEModel:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8), gamma=0.8):
        self.clip_limit = clip_limit
        self.tile_grid_size = tile_grid_size
        self.gamma = gamma

    def process_image(self, image_np):
        clahe = cv2.createCLAHE(clipLimit=self.clip_limit, tileGridSize=self.tile_grid_size)
        clahe_image = clahe.apply(image_np)
        enhanced_image = np.array(255 * (clahe_image / 255) ** self.gamma, dtype='uint8')
        return enhanced_image

app = Flask(__name__)
CORS(app, origins='*')

# Load the model using `CLAHEModel` instead of `XRayDehazeModel`
with open('clahe.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found in the request"}), 400
    
    file = request.files['image']
    image = Image.open(file).convert('L')
    image_np = np.array(image)
    processed_image_np = model.process_image(image_np)
    processed_image = Image.fromarray(processed_image_np)
    img_io = io.BytesIO()
    processed_image.save(img_io, 'JPEG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='localhost', port=7000)
