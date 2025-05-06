"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function DehazePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedImageUrl(URL.createObjectURL(file));
        setProcessedImage(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('https://dehaze-sd-api-latest.onrender.com/process-image', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setProcessedImage(imageUrl);
            } else {
                throw new Error("Failed to process image");
            }
        } catch (error) {
            console.error("Error:", error);
            setError(error.message || "An error occurred during processing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0a0e2a] to-[#0f1a3a] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67E331] to-[#8aff5e] mb-4">
                        Dehaze X-ray Image
                    </h1>
                    <p className="text-lg text-[#c4d6ff] max-w-3xl mx-auto">
                        Enhance image clarity by removing noise, fog, and low-contrast areas that obscure details in medical images.
                        Our advanced filtering brings out subtle textures and underlying structures without distortion.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-[#67E331]/20 shadow-lg 
                            hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-2xl before:-z-10">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#67E331] to-[#8aff5e]">
                            Upload and Process Your Image
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                        {/* Upload Section */}
                        <div className="border-2 border-dashed border-[#67E331]/50 rounded-xl p-8 text-center bg-[#13163F]/20 hover:bg-[#13163F]/30 transition-colors duration-200
                                    relative overflow-hidden group w-full max-w-md">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#67E331]/30 to-[#13163F]/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <label className="block mb-4 font-medium text-[#c4d6ff] text-lg">
                                Select X-ray Image
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#67E331]/20 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#67E331]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="mt-2 text-sm text-[#c4d6ff]/80">
                                    Drag & drop files here or click to browse
                                </p>
                                <p className="mt-1 text-xs text-[#67E331]/60">
                                    Supports JPG, PNG, DICOM formats
                                </p>
                            </div>
                        </div>

                        {/* Process Button */}
                        <div className="flex flex-col items-center">
                            <button
                                className={`px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 ${
                                    !selectedFile || loading
                                        ? 'bg-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#67E331] to-[#13163F] hover:from-[#13163F] hover:to-[#67E331] shadow-lg hover:shadow-[#67E331]/40'
                                } relative overflow-hidden group`}
                                onClick={handleUpload}
                                disabled={!selectedFile || loading}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Dehaze Image
                                        </>
                                    )}
                                </span>
                            </button>

                            {selectedFile && (
                                <p className="mt-4 text-sm text-[#c4d6ff]/80">
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedImageUrl && (
                            <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-[#67E331]/20">
                                <h3 className="text-lg font-medium text-[#c4d6ff] mb-4">Original Image</h3>
                                <div className="flex justify-center">
                                    <img 
                                        src={selectedImageUrl} 
                                        alt="Uploaded" 
                                        className="max-h-80 rounded-lg shadow-lg object-contain" 
                                    />
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-[#67E331]/20 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#67E331] mx-auto"></div>
                                    <p className="mt-4 text-[#c4d6ff]/80">Processing your image...</p>
                                </div>
                            </div>
                        )}

                        {processedImage && (
                            <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-[#67E331]/20">
                                <h3 className="text-lg font-medium text-[#c4d6ff] mb-4">Dehazed Result</h3>
                                <div className="flex justify-center">
                                    <img 
                                        src={processedImage} 
                                        alt="Processed" 
                                        className="max-h-80 rounded-lg shadow-lg object-contain" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/30 backdrop-blur-sm rounded-lg border border-red-700/60 text-red-200">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 px-4 py-4 bg-[#13163F]/30 backdrop-blur-lg rounded-xl border border-[#67E331]/20 shadow-lg">
                    <Link href={'/home'}
                        className="px-6 py-2 bg-gradient-to-r from-[#13163F] to-[#67E331] text-white rounded-lg hover:from-[#67E331] hover:to-[#13163F] transition-all duration-300 font-medium"
                    >
                        Go to Home
                    </Link>
                    <Link href={'/Upload'} 
                        className="px-6 py-2 bg-gradient-to-r from-[#67E331] to-[#13163F] text-white rounded-lg hover:from-[#13163F] hover:to-[#67E331] transition-all duration-300 font-medium"
                    >
                        Generate 3D Model
                    </Link>
                </div>
            </div>
        </main>
    );
}