"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function UploadDicomFolder() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            console.error("No files selected!");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("dicom_files", selectedFiles[i]);
        }

        try {
            const response = await axios.post('http://localhost:5000/generate_3d_model', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob'
            });

            // Create a download URL for the 3D model file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
        } catch (error) {
            console.error("There was an error uploading the files!", error);
        }
    };

    return (
        <div>
            <h2>Upload DICOM Folder</h2>
            <form onSubmit={handleSubmit}>
                {/* Allow selection of an entire folder */}
                <input
                    type="file"
                    webkitdirectory="true"
                    multiple
                    onChange={handleFileChange}
                />
                <button type="submit">Upload and Generate 3D Model</button>
            </form>
            {downloadUrl && (
                <div>
                    <a href={downloadUrl} download="3d_model.stl">
                        Download 3D Model
                    </a>
                </div>
            )}
        </div>
    );
}