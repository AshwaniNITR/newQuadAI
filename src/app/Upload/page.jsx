"use client"
import React, { useState } from 'react';
import axios from 'axios';
import ModelViewer from "@/app/components/ModelViewer/ModelViewer"
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Footer/Footer';
export default function UploadDicomFolder() {
    const [showMe, setShowMe] =       useState(false);
     const handleClick = () => {
    setShowMe(!showMe);
     }; 
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
        <main className="flex min-h-screen flex-col max-w-full container ">
         <Navbar/>
        <div className='bg-gray-200 py-8 mt-20' id='Upload'>
            <h1 className='fade-in-up text-center pt-0 text-4xl sm:text-5xl lg:text-6xl mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] font-extrabold'>
              Generate 3d model 
            </h1>
            <div className='p-10'>
            <p className='text-[#13163F] p-9'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum enim nihil, magni quia cum officia quos nulla molestiae blanditiis eaque, quae fugit laudantium voluptatum esse a nobis asperiores dignissimos doloremque?Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum nesciunt totam animi! Quae praesentium in corporis accusantium at sapiente ipsam fuga quos officiis optio? Veritatis illo quae sunt suscipit soluta!</p>
            </div>
            <div className={`shadow-lg  bg-[#13163F] rounded-lg shadow-white py-4 md:m-14 m-8`}>
            <h2 className='fade-in-up text-center pt-0 mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold text-3xl'>Upload DICOM Folder</h2>
            <form onSubmit={handleSubmit}>
                {/* Allow selection of an entire folder */}
                <div className='flex justify-around mt-6 flex-wrap px-7 gap-4'>
                <input
                    type="file"
                    webkitdirectory="true"
                    multiple
                    className='fade-in-up text-center pt-0  mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold'
                    onChange={handleFileChange}
                />
                <button type="submit"
                onClick={handleClick} 
                className='px-6 py-3 my-1 w-fit rounded-full mr-4 bg-white hover:bg-slate-300  text-white bg-gradient-to-br from-[#13163F] to-[#67E331]'>{showMe ? 'Hide it..' : 'Upload and generate 3D Model'}</button> {showMe && <ModelViewer modelPath={`http://127.0.0.1:5000/static/output_model.stl`}/>}
                </div>
            </form>
            {downloadUrl && (
                <div>
                    <a href={downloadUrl} download="3d_model.stl">
                        Download 3D Model
                    </a>
                </div>
            )}
            </div>
        </div>
        <Footer/>
        </main>
    );
}