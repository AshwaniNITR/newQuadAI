"use client"
import { useState } from 'react';

export default function DehazePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setProcessedImage(null); // Clear previous image
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:7000/process_image', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setProcessedImage(imageUrl);
            } else {
                console.error("Failed to process image");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dehaze X-ray Image</h1>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload} disabled={!selectedFile}>Upload and Process</button>
            {processedImage && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Dehazed Image:</h3>
                    <img src={processedImage} alt="Dehazed Output" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}
