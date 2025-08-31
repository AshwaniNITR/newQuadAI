"use client";
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Home/Navbar';
import Herosection from '../components/Home/Herosection'
import About from '../components/AboutUs/About'
import Footer from '../components/Footer/Footer'

const HomePage = () => {
  return (
    <ProtectedRoute 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <main className="flex min-h-screen flex-col max-w-full container">
        <Navbar/>
        <div>
          <Herosection/>
          <About/>
          {/* <Upload/> */}
          {/* <EventPage/> */}
          {/* <Dehaze/> */}
        </div>
        <Footer/>
      </main>
    </ProtectedRoute>
  );
}

export default HomePage;