"use client";
import React from 'react';
import Navbar from '../components/Home/Navbar';
import Herosection from '../components/Home/Herosection'
import Upload from '../Upload/page'
import About from '../components/AboutUs/About'
import Dehaze from '../Dehaze/page'
// import EventPage from '../components/Events/EventsPage'
import Footer from '../components/Footer/Footer'

const hero = () => {
  return (
    
    <main className="flex min-h-screen flex-col max-w-full container ">
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
  )
}

export default hero