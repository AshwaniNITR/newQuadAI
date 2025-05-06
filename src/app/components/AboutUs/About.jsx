import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section id='About' className="min-h-screen w-full py-20 px-4 md:px-8 bg-gradient-to-br from-[#0a0e2a] to-[#0f1a3a]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67E331] to-[#8aff5e] mb-4">
            About Us
          </h1>
          <p className="text-lg text-[#c4d6ff] max-w-3xl mx-auto">
            Transforming 2D images into immersive 6D experiences with enhanced clarity and precision
          </p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-8">
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-6 border border-[#67E331]/20 shadow-lg">
            <p className="text-[#c4d6ff] text-lg leading-relaxed">
              This project takes 2D images to new dimensions, converting them into detailed 6D models that capture both spatial and temporal nuances. By integrating image dehazing techniques, it enhances clarity and precision, especially in medical imaging.
            </p>
          </div>
          
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl overflow-hidden border border-[#67E331]/20 shadow-lg">
            <Image 
              src='/Images/x-rayDp.avif'
              alt='Medical visualization'
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Input Card */}
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-8 border border-[#67E331]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-3xl before:-z-10">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-[#13163F] to-[#67E331] text-white flex items-center justify-center rounded-full shadow-lg">
              <span className="font-medium">Input</span>
            </div>
            <div className="mt-16 text-center">
              <p className="text-[#c4d6ff] text-lg leading-relaxed">
                The model takes in 2D image slices, such as MRI or X-ray scans, which may initially appear hazy or unclear due to noise, low contrast, or environmental conditions.
              </p>
            </div>
          </div>

          {/* Processing Card */}
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-8 border border-[#67E331]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-3xl before:-z-10">
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-[#13163F] to-[#67E331] text-white flex items-center justify-center rounded-full shadow-lg">
              <span className="font-medium">Process</span>
            </div>
            <div className="mb-16 text-center">
              <p className="text-[#c4d6ff] text-lg leading-relaxed">
                The images are dehazed, enhancing clarity, then reconstructed into 6D models that incorporate both spatial and temporal depth using advanced algorithms.
              </p>
            </div>
          </div>

          {/* Output Card */}
          <div className="bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-8 border border-[#67E331]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#67E331]/10 before:to-[#13163F]/20 before:border before:border-[#67E331]/10 before:rounded-3xl before:-z-10">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-[#13163F] to-[#67E331] text-white flex items-center justify-center rounded-full shadow-lg">
              <span className="font-medium">Output</span>
            </div>
            <div className="mt-16 text-center">
              <p className="text-[#c4d6ff] text-lg leading-relaxed">
                The output is a detailed 6D model that provides enhanced visualization for improved analysis in medical, engineering, and research applications.
              </p>
            </div>
          </div>
        </div>

        {/* Full Width Description (Desktop) */}
        <div className="hidden md:block mt-16 bg-[#13163F]/30 backdrop-blur-lg rounded-3xl p-8 border border-[#67E331]/20 shadow-lg">
          <p className="text-[#c4d6ff] text-lg leading-relaxed">
            Beyond healthcare, this approach unlocks potential in fields like engineering, archaeology, and robotics, offering richer, multidimensional insights into complex structures. The combination of 6D reconstruction and dehazing ensures more precise, actionable data for decision-making across diverse real-world applications.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;