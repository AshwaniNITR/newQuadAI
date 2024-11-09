"use client";
import React from 'react';
import '../SignInUp/Sign.css';
import Image from 'next/image';
import AboutM from '../AboutUs/AboutM';
import { useState } from 'react';


const Herosection = () => {
  const [showAboutMe, setShowAboutMe] = useState(false);

  const handleClick = () => {
    setShowAboutMe(!showAboutMe);
  }; 
    const images = {
        bgImgRight:
          "https://res.cloudinary.com/dg3qhhnjo/image/upload/v1730450985/ImageAi/ohgkl68z28eoqrotrljw.jpg",
        }
  return (
    <>
    <section id='Home'
    className="min-h-screen w-[100%]  lg:py-24 pt-24 bg-no-repeat flex flex-col  "
    style={{
      backgroundImage: `url(${images.bgImgRight})`,
    }}>
        <div className='fade-in-right grid grid-cols-1 lg:grid-cols-12 p-24'>
            <div className="col-span-7 place-self-center text-center sm:text-left">
        <h1 className="text-white  mb-6 text-5xl  lg:text-6xl  mt-2 font-extrabold"><span className='text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331]'>Hexadepth</span>
      </h1>
        <p className='text-[#ADB7BE] text-lg lg:text-2xl  mb-6 mt-4'>Transforming 2D imagery into immersive 6D realities, dehazing brings unprecedented depth, clarity, and life to visuals. By enhancing textures, light, and spatial detail, this technology creates vivid, multidimensional experiences, revolutionizing applications in gaming, simulations, and virtual reality.<br/><span className='text-xl'>Welcome to the dynamic world !</span></p>
        <div>
          <button onClick={handleClick} className='px-6 py-3 my-1  w-full md:w-fit rounded-full mr-4 bg-white hover:bg-slate-300  text-white bg-gradient-to-br from-[#13163F] to-[#67E331]'>
          {showAboutMe ? 'Hide it..' : 'Explore'}</button> {showAboutMe && <AboutM/>}
          
         
        </div>
        </div>
        <div className="col-span-5 place-self-center mt-2 ">
            <Image className="rounded-lg hidden  md:flex place-self-center md:my-5 "
            src='/images/healthcare.avif'
            alt='hero-image'
            height={200}
            width={400}
            />

        </div>
        </div>
        
    </section>
    </>
  )
}

export default Herosection