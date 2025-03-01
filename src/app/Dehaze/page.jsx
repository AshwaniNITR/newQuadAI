"use client"
import { useState } from 'react';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
export default function DehazePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null); // To store the preview URL of the uploaded image

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedImageUrl(URL.createObjectURL(file)); // Create and set the preview URL for the selected file
        setProcessedImage(null); // Clear the previous processed image
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile); // Ensure 'file' matches the API route's form data key

        try {
            const response = await fetch('http://127.0.0.1:7000/process-image', {
                method: 'POST',
                body: formData,
            });
            console.log(response);

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
        <main className="flex min-h-screen flex-col max-w-full container">
            <Navbar/>
            <div className='bg-gray-200 py-8 h-full mt-20'>
                <h1 className='fade-in-up text-center text-4xl sm:text-5xl lg:text-6xl mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] font-extrabold'>Dehaze X-ray Image</h1>
                <div className='p-10'>
                    <p className='text-[#13163F] p-9'>
                        The dehazing component of this project enhances image clarity by removing noise, fog, and low-contrast areas that often obscure details in 2D medical images, such as MRI or X-ray scans. By refining visual quality, this process brings out subtle textures and underlying structures, making essential details more discernible. Dehazing applies advanced filtering and contrast adjustment techniques, amplifying image fidelity without distorting true anatomical features. This improved visibility is crucial in medical diagnostics, enabling clinicians to detect anomalies with greater accuracy, and also extends to fields like remote sensing, industrial inspection, and security imaging, where precision is vital.
                    </p>
                </div>
                <div className="shadow-lg bg-[#13163F] rounded-lg py-4 md:m-14 m-8">
                    <h2 className="text-center text-3xl text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold">Dehaze Images</h2>
                    <div className="flex justify-around mt-6 flex-wrap px-7 gap-4">
                        <input 
                            className="bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold" 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                        <button 
                            className="px-6 py-3 w-fit rounded-full bg-white hover:bg-slate-300 text-white bg-gradient-to-br from-[#13163F] to-[#67E331]" 
                            onClick={handleUpload} 
                            disabled={!selectedFile}
                        >
                            Upload and Process
                        </button>
                        <div className="flex flex-col justify-center items-center" style={{ marginTop: '20px' }}>
                            {selectedImageUrl && (
                                <div>
                                    <h3 className="text-white font-bold">Uploaded Image:</h3>
                                    <Image src={selectedImageUrl} alt="Uploaded Image" style={{ maxWidth: '80%', maxHeight: '80%' }} />
                                </div>
                            )}
                            {processedImage && (
                                <div>
                                    <h3 className="text-white font-bold">Dehazed Image:</h3>
                                    <Image src={processedImage} alt="Dehazed Output" style={{ maxWidth: '80%', maxHeight: '80%' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
}
