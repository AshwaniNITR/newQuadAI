"use client";
import Link from 'next/link'
import React,{useState} from 'react'
import NavLink from './NavLink'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';



import MenuOver from './MenuOver';
const navLinks =[
  {
    title:"Home",
    path:"/home",
  },
  {
    title:"About",
    path:"/home#About",
  },
  {
    title:"3DModel",
    path:"/Upload",
  },
  {
    title:"Dehaze",
    path:"/Dehaze",
  },
]

const Navbar = () => {
  const [navbarOpen,setnavbarOpen] =useState(false);
  return (

    <nav className='fixed top-0 right-0 left-0 z-10 md:pt-1 md:pb-0 py-4 bg-[#13163F] bg-opacity-90'>
      <div className='flex flex-wrap items-center justify-between mx-auto px-4'>
        <div>
        <Image className="place-self-center md:my-5 bg-transparent"
            src='/images/hexad.png'
            alt='PAYAL'
            height={45}
            width={65}
          />
        </div>
        <div className='mobile-menu block md:hidden '>
          { !navbarOpen?(
              <button onClick={()=>setnavbarOpen(true)} 
              className='flex items-center px-3 mx-2 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white'>
                <FontAwesomeIcon icon={faBars} className='h-5 w-5'/>
              </button>
            ):(
              <button onClick={()=>setnavbarOpen(false)} 
              className='flex items-center px-3 mx-2 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white'>
                <FontAwesomeIcon icon={faTimes} className='h-5 w-5'/>
              </button>
            )
          }

        </div>
        <div className="menu hidden md:block md:w-auto " id='navbar'>
          <ul className='flex md:gap-24'>
            {
              navLinks.map((Link,index)=>(
                <li key={index}>
                  <NavLink href={Link.path} title={Link.title}/>
                </li>
              ))

            }
            <Link className="px-4 py-1 mb-2 bg-gradient-to-br from-[#13163F] to-[#67E331] text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300" href={"/"}>
             Click Me
             </Link>

          </ul>
        </div>
        </div>
        {navbarOpen ?<MenuOver links={navLinks}/>:null}

        </nav>
  )
}

export default Navbar