"use client";
import React, { useEffect, useState, useTransition } from 'react';
import TabButton from './TabButton';
import { Signup } from './SignUp';
import { SignIn } from './SignIn';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './Sign.css';
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
  const router = useRouter();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch current user
        const response = await fetch('/api/getCurrentUser'); 
        const data = await response.json(); // Parse JSON from the response
        
        if (data.isVerified) { // Check if the user is verified
          setUser(true);
          setTab("SignIn"); // Switch to SignIn tab if the user is verified
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

  // const images = {
  //   bgImg: "https://res.cloudinary.com/dg3qhhnjo/image/upload/v1730529115/ImageAi/hyfsmvv3z2lnfb11mbwe.jpg",
  // };

  const selectedTab = TAB_DATA.find((t) => t.id === tab);

  return (
    <section>
      <h1 className='fade-in-up text-center pt-0 text-4xl sm:text-5xl lg:text-6xl mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] font-extrabold'>
       Welcome To Hexadepth
      </h1>

      <div className='fade-in-right grid md:grid-cols-2 my-6 md:my-12 py-12 p-8 md:bg-gray-200 rounded-lg'>
        <div className='md:ml-10 bg-gray-200 p-8 rounded-md'>
          <p className='font-bold my-2 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] md:text-5xl text-4xl'>Hexadepth</p>
          <p className='text-[#ADB7BE] mb-4 mt-4 max-w-md md:text-2xl text-xl '>
          Elevate 2D visuals to immersive 6D models, enhancing depth, clarity, and realism through advanced dehazing techniques.
          </p>
          <p className='text-[#ADB7BE] mb-4 mt-4  md:text-xl text-lg '>
           Unlock new dimensions in visual experience !!
          </p>
          <Image className="rounded-md my-5 "
            src='/images/dp-ai.jpeg'
            alt='hero-image'
            height={250}
            width={450}
          />
          <Link className="px-10 py-3 my-10  bg-gradient-to-br from-[#13163F] to-[#67E331] text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300" href={"/home"}>
            Explore
          </Link>
        </div>

        <div className=' fade-in-right bg-gradient-to-br from-[#13163F] to-[#67E331] rounded-lg p-7 mt-8'>
          <div className='flex flex-row max-w-full justify-evenly'>
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
          <div className='mt-8'>
            {selectedTab ? selectedTab.thing : <p>Tab not found</p>}
          </div>
        </div> 
      </div>
    </section>
  );
};
