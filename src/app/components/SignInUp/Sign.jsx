"use client";
import React, { useEffect, useState, useTransition } from 'react';
import TabButton from './TabButton';
import { Signup } from './Signup';
import { SignIn } from './SignIn';
import Link from 'next/link';
import Image from 'next/image';

const TAB_DATA = [
  {
    title: "SignUp",
    id: "SignUp",
    thing: <Signup />,
  },
  {
    title: "SignIn",
    id: "SignIn",
    thing: <SignIn />,
  },
];

export const Sign = () => {
  const [tab, setTab] = useState("SignUp");
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      console.log(user);
      console.log(isPending)
      try {
        const response = await fetch('/api/getCurrentUser'); 
        const data = await response.json();
        
        if (data.isVerified) {
          setUser(true);
          setTab("SignIn");
        } else {
          setUser(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    
    fetchUser();
  }, []);

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const selectedTab = TAB_DATA.find((t) => t.id === tab);

  return (
    <section className="min-h-screen  px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className='text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-12'>
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-text">
            Welcome To Hexadepth
          </span>
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-blue-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-blue-900/30 hover:shadow-emerald-400/20 transition-all duration-500'>
            <p className='font-bold mb-6 text-4xl md:text-5xl bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent'>
              Hexadepth
            </p>
            <p className='text-blue-100 mb-6 text-lg md:text-xl leading-relaxed'>
              Elevate 2D visuals to immersive 6D models, enhancing depth, clarity, and realism through advanced dehazing techniques.
            </p>
            <p className='text-emerald-200 mb-8 text-xl md:text-2xl font-medium'>
              Unlock new dimensions in visual experience!
            </p>
            
            <div className="relative w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <Image 
                src='/Images/dp-ai.jpeg'
                alt='hero-image'
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
            </div>
            
            <Link 
              className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-emerald-400/40 transition-all duration-300 hover:scale-[1.02]"
              href={"/home"}
            >
              Explore Now
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className='bg-gradient-to-br from-blue-900/40 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-blue-900/30 hover:shadow-emerald-400/20 transition-all duration-500'>
            <div className='flex flex-row justify-center space-x-4 mb-8'>
              <TabButton
                selectTab={() => handleTabChange('SignUp')}
                active={tab === 'SignUp'}
              >
                Sign Up
              </TabButton>
              <TabButton
                selectTab={() => handleTabChange('SignIn')}
                active={tab === 'SignIn'}
              >
                Sign In
              </TabButton>
            </div>
            
            <div className='mt-6'>
              {selectedTab ? selectedTab.thing : <p className="text-blue-200">Tab not found</p>}
            </div>
          </div> 
        </div>
      </div>
    </section>
  );
};