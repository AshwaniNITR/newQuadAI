'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Link from 'next/link';

export default function DicomUploader() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(4);
  
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);

  const checkRateLimit = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const rateLimitData = JSON.parse(localStorage.getItem('rateLimit')) || { 
      count: 0, 
      lastRequestDate: today 
    };

    if (rateLimitData.lastRequestDate !== today) {
      rateLimitData.count = 0;
      rateLimitData.lastRequestDate = today;
      localStorage.setItem('rateLimit', JSON.stringify(rateLimitData));
    }

    setRemainingRequests(4 - rateLimitData.count);
    return rateLimitData;
  };

  // ... (keep all your existing Three.js initialization and model loading code)
   // Three.js initialization (same as before)

   const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setSuccess(false);
    setModelData(null);
  };


   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError("Please select at least one DICOM file");
      return;
    }

    const rateLimitData = checkRateLimit();
  if (rateLimitData.count >= 4) {
    setError("Daily limit reached (4 conversions per day). Please try again tomorrow.");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(false);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('dicom_files', file);
      });

      const response = await fetch('/api/generate_3d_model', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process DICOM files');
      }

      const data = await response.json();
      
      setModelData(data.model_data);
      setProcessingTime(data.processing_time);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error.message || 'An error occurred during processing');
    } finally {
      setLoading(false);
    }
  };


   useEffect(() => {
    if (!canvasRef.current || !modelData) return;

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true 
      });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      controlsRef.current = controls;
      
      const animate = () => {
        requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      animate();
    }
    
    if (modelData && sceneRef.current) {
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
      
      const binary = atob(modelData);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const loader = new STLLoader();
      loader.load(url, (geometry) => {
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.center();
        
        const boxSize = new THREE.Vector3();
        geometry.boundingBox.getSize(boxSize);
        const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
        const scale = 3 / maxDim;
        
        const material = new THREE.MeshPhongMaterial({ 
          color: 0xffffff, // White color
          specular: 0x111111,
          shininess: 100,
          emissive: 0x222222 // Slight emission for better visibility
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        
        sceneRef.current.add(mesh);
        modelRef.current = mesh;
        
        cameraRef.current.position.z = 5;
        
        URL.revokeObjectURL(url);
      });
    }

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   setFiles(selectedFiles);
  //   setError(null);
  //   setSuccess(false);
  //   setModelData(null);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (files.length === 0) {
  //     setError("Please select at least one DICOM file");
  //     return;
  //   }

  //   const rateLimitData = checkRateLimit();
  //   if (rateLimitData.count >= 4) {
  //     setError("Daily limit reached (4 conversions per day). Please try again tomorrow.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   setSuccess(false);
    
  //   try {
  //     const formData = new FormData();
  //     files.forEach(file => formData.append('dicom_files', file));

  //     const response = await fetch('https://hexa-api-latest.onrender.com/generate_3d_model', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to process DICOM files');
  //     }

  //     const data = await response.json();
      
  //     // Update rate limit
  //     const updatedRateLimit = {
  //       count: rateLimitData.count + 1,
  //       lastRequestDate: today
  //     };
  //     localStorage.setItem('rateLimit', JSON.stringify(updatedRateLimit));
  //     setRemainingRequests(4 - updatedRateLimit.count);
      
  //     setModelData(data.model_data);
  //     setProcessingTime(data.processing_time);
  //     setSuccess(true);
      
  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //     setError(error.message || 'An error occurred during processing');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  }, [modelData]); // Add this line to close the useEffect dependency array
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e2a] to-[#0f1a3a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67E331] to-[#8aff5e] mb-4">
            DICOM to 3D Model Converter
          </h1>
          <p className="text-lg text-[#c4d6ff] max-w-2xl mx-auto">
            Transform medical imaging data into interactive 3D models with our advanced processing tool
          </p>
        </div>

        {/* Rate Limit Indicator */}
        <div className="text-center mb-6 text-sm text-[#67E331] bg-[#13163F]/30 backdrop-blur-sm rounded-lg p-2 border border-[#67E331]/20">
          {remainingRequests > 0 ? (
            <p>You have {remainingRequests} free conversions remaining today</p>
          ) : (
            <p>You have used all 4 free conversions today</p>
          )}
        </div>

        {/* Upload Card */}
        <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-[#67E331]/20 shadow-lg 
                        hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-2xl before:-z-10">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#67E331]/50 rounded-xl p-8 text-center bg-[#13163F]/20 hover:bg-[#13163F]/30 transition-colors duration-200
                          relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#67E331]/30 to-[#13163F]/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <label className="block mb-4 font-medium text-[#c4d6ff] text-lg">
                Upload DICOM Files
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".dcm"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#67E331]/20 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#67E331]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-[#c4d6ff]/80">
                  Drag & drop files here or click to browse
                </p>
                <p className="mt-1 text-xs text-[#67E331]/60">
                  Supports multiple .dcm files
                </p>
              </div>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="mt-2 bg-[#13163F]/30 rounded-lg p-4 backdrop-blur-sm border border-[#67E331]/20">
                <p className="text-sm font-medium text-[#c4d6ff]">{files.length} file(s) selected</p>
                <ul className="mt-2 text-xs text-[#c4d6ff]/80 max-h-24 overflow-y-auto space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#67E331]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || files.length === 0}
              className={`mt-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 ${
                loading || files.length === 0 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#67E331] to-[#13163F] hover:from-[#13163F] hover:to-[#67E331] shadow-lg hover:shadow-[#67E331]/40'
              } relative overflow-hidden group`}
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
                    Generate 3D Model
                  </>
                )}
              </span>
            </button>
          </form>
          
          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#67E331]"></div>
              </div>
              <p className="mt-4 text-[#c4d6ff]/80">Processing DICOM files. This may take a few moments...</p>
            </div>
          )}
          
          {/* Error State */}
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
          
          {/* Success State */}
          {success && (
            <div className="mt-6 p-4 bg-[#67E331]/20 backdrop-blur-sm rounded-lg border border-[#67E331]/30 text-[#c4d6ff]">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#67E331]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3D model generated successfully in {processingTime} seconds! View it below.
              </div>
            </div>
          )}
        </div>
        
        {/* 3D Model Viewer */}
        {modelData && (
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-2xl p-6 border border-[#67E331]/20 shadow-lg overflow-hidden
                          relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-2xl before:-z-10">
            <h2 className="text-2xl font-semibold mb-6 text-[#c4d6ff]">3D Model Viewer</h2>
            <div className="bg-black/40 rounded-xl overflow-hidden border border-[#67E331]/30 shadow-inner">
              <canvas 
                ref={canvasRef} 
                className="w-full h-[500px] rounded-lg"
              />
            </div>
            <div className="mt-4 text-sm text-[#c4d6ff]/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#67E331]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Drag to rotate | Scroll to zoom | Shift+drag to pan
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  const binary = atob(modelData);
                  const bytes = new Uint8Array(binary.length);
                  for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                  }
                  const blob = new Blob([bytes], { type: 'application/octet-stream' });
                  
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'model.stl';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#67E331] to-[#13163F] text-white rounded-xl hover:from-[#13163F] hover:to-[#67E331] shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download STL File
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 px-4 py-4 bg-[#13163F]/30 backdrop-blur-lg rounded-xl border border-[#67E331]/20 shadow-lg">
          <Link href={'/home'}
            className="px-6 py-2 bg-gradient-to-r from-[#13163F] to-[#67E331] text-white rounded-lg hover:from-[#67E331] hover:to-[#13163F] transition-all duration-300 font-medium"
          >
            Go to Home
          </Link>
          <Link href={'/Dehaze'} 
            className="px-6 py-2 bg-gradient-to-r from-[#67E331] to-[#13163F] text-white rounded-lg hover:from-[#13163F] hover:to-[#67E331] transition-all duration-300 font-medium"
          >
            Dehaze Image
          </Link>
        </div>
      </div>
    </div>
  );
}