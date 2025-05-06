"use client";
import React from 'react';
import { useState } from 'react';
import AboutM from '../AboutUs/AboutM';
import Image from 'next/image';

const Herosection = () => {
  const [showAboutMe, setShowAboutMe] = useState(false);

  const handleClick = () => {
    setShowAboutMe(!showAboutMe);
  };

  return (
    <section 
      id='Home'
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-[#0a0e2a] to-[#0f1a3a]"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative">
            <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-8 border border-[#67E331]/20 shadow-lg 
                          hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                          before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-3xl before:-z-10
                          group">
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#67E331] to-[#8aff5e]">
                  Hexadepth
                </span>
              </h1>
              
              <p className="text-[#c4d6ff] text-lg lg:text-xl mb-6 leading-relaxed">
                Transforming 2D imagery into immersive 6D realities, dehazing brings unprecedented depth, clarity, and life to visuals. By enhancing textures, light, and spatial detail, this technology creates vivid, multidimensional experiences.
              </p>
              
              <p className="text-xl text-[#67E331] font-medium">
                Welcome to the dynamic world!
              </p>
              
              <button 
                onClick={handleClick} 
                className="mt-6 px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 
                          bg-gradient-to-r from-[#13163F] to-[#67E331] hover:from-[#67E331] hover:to-[#13163F]
                          shadow-lg hover:shadow-[#67E331]/40 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {showAboutMe ? 'Hide Details' : 'Explore More'}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#67E331] to-[#13163F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>

            {showAboutMe && (
              <div className="mt-6 bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-6 border border-[#67E331]/20 shadow-lg animate-fade-in">
                <AboutM />
              </div>
            )}
          </div>

          {/* Image Content */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-96 rounded-3xl overflow-hidden 
                          bg-[#13163F]/30 backdrop-blur-lg border border-[#67E331]/20 shadow-lg
                          group hover:shadow-[#67E331]/40 transition-all duration-300">
              <Image
                src='/Images/healthcare.avif'
                alt='Hexadepth visualization'
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13163F]/80 to-[#67E331]/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;