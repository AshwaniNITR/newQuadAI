from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app,origins='*')

class CLAHEModel:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8), gamma=0.8):
        self.clip_limit = clip_limit
        self.tile_grid_size = tile_grid_size
        self.gamma = gamma

    def apply_clahe_and_gamma(self, image):
        # Convert the image to grayscale if it's not
        if image.mode != 'L':
            image = image.convert('L')
        image = np.array(image)

        # Apply CLAHE
        clahe = cv2.createCLAHE(clipLimit=self.clip_limit, tileGridSize=self.tile_grid_size)
        clahe_image = clahe.apply(image)

        # Apply gamma correction
        enhanced_image = np.array(255 * (clahe_image / 255) ** self.gamma, dtype='uint8')
        return Image.fromarray(enhanced_image)

# Instantiate CLAHE model
clahe_model = CLAHEModel()

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    try:
        image = Image.open(file.stream)
        enhanced_image = clahe_model.apply_clahe_and_gamma(image)

        # Save enhanced image to an in-memory byte stream to send as response
        img_io = io.BytesIO()
        enhanced_image.save(img_io, 'JPEG')
        img_io.seek(0)

        return send_file(img_io, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=7000, debug=True)
