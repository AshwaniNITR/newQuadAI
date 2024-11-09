from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import pickle
import os
import SimpleITK as sitk
import numpy as np
from skimage import measure
import trimesh
import shutil

app = Flask(__name__)
CORS(app,origins='*')

# Load the model (in this case, any required pre-trained data)
model_path = "model.pkl"
if os.path.exists(model_path):
    with open(model_path, "rb") as model_file:
        model = pickle.load(model_file)
        print("Model loaded successfully.")
else:
    model = None
    print("Model file not found.")

# Path to your existing DICOM folder on your desktop
dicom_dir = r"C:\Users\HP\Desktop\Test"

# Create an endpoint to process the DICOM folder and generate 3D model
@app.route('/generate_3d_model', methods=['POST'])
def generate_3d_model():
    # Check if DICOM files are included in the request
    if not os.path.exists(dicom_dir):
        return jsonify({"error": "DICOM folder not found at the specified path."}), 400

    # List all files in the directory (make sure they're DICOM files)
    dicom_files = [f for f in os.listdir(dicom_dir) if f.endswith('.dcm')]
    
    if not dicom_files:
        return jsonify({"error": "No DICOM files found in the specified folder."}), 400

    # Read the DICOM series
    try:
        reader = sitk.ImageSeriesReader()
        dicom_file_paths = [os.path.join(dicom_dir, f) for f in dicom_files]
        reader.SetFileNames(dicom_file_paths)
        image = reader.Execute()
        image_array = sitk.GetArrayFromImage(image)

        # Apply segmentation and reconstruction logic (example thresholding)
        segmented_volume = (image_array > 0.5)  # Modify threshold as needed
        verts, faces, _, _ = measure.marching_cubes(segmented_volume, step_size=1)

        # Save the 3D model to an STL file
        stl_file = "output_model.stl"
        mesh = trimesh.Trimesh(vertices=verts, faces=faces)
        mesh.export(stl_file)
    except Exception as e:
        return jsonify({"error": f"Processing failed: {e}"}), 500

    # Return the 3D model file for download
    return send_file(stl_file, as_attachment=True)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
@app.route('/')
def index():
     return render_template('index.html')
