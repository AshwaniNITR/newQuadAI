"use client"
import React from 'react'
import '../SignInUp/Sign.css';
import { useState } from 'react';
const Upload = () => {
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
  };
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
    <div className='bg-[#13163F] py-8' id='Upload'> 
       <h1 className='fade-in-up text-center pt-0 text-4xl sm:text-5xl lg:text-6xl mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] font-extrabold'>
       Upload 
      </h1>
        <div className='mt-4'>
            <h2 className='fade-in-up text-center pt-0   mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold'>Upload DICOM Folder</h2>
            <form onSubmit={handleSubmit}>
                {/* Allow selection of an entire folder */}
                <input
                    type="file"
                    webkitdirectory="true"
                    multiple
                    onChange={handleFileChange}
                    className='fade-in-up text-center pt-0  mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold'
                />
                <button type="submit" className='fade-in-up text-center pt-0  mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold'>Upload and Generate 3D Model</button>
            </form>
            {downloadUrl && (
                <div className='fade-in-up text-center pt-0  mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold'>
                    <a className="fade-in-up text-center pt-0 mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFF] to-[#67E331] font-extrabold" href={downloadUrl} download="3d_model.stl">
                        Download 3D Model
                    </a>
                </div>
            )}
        </div>
    );
    </div>
  )
}

export default Upload