"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import Image from "next/image";

import MenuOver from "./MenuOver";
const navLinks = [
  {
    title: "Home",
    path: "/home",
  },
  {
    title: "About",
    path: "/home#About",
  },
  {
    title: "3DModel",
    path: "/Upload",
  },
  {
    title: "Dehaze",
    path: "/Dehaze",
  },
];

const Navbar = () => {
  const [navbarOpen, setnavbarOpen] = useState(false);
  return (
    <nav className="fixed top-0 right-0 left-0 z-10 md:pt-1 md:pb-0 py-4 bg-[#13163F] bg-opacity-90">
      <div className="flex flex-wrap items-center justify-between mx-auto px-4">
        <div>
          <Image
            className="place-self-center md:my-5 bg-transparent"
            src="/images/hexad.png"
            alt="PAYAL"
            height={45}
            width={65}
          />
        </div>
        <div className="mobile-menu block md:hidden ">
          {!navbarOpen ? (
            <button
              onClick={() => setnavbarOpen(true)}
              className="flex items-center px-3 mx-2 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              {/* <FontAwesomeIcon icon={faBars} className='h-5 w-5'/> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setnavbarOpen(false)}
              className="flex items-center px-3 mx-2 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              {/* <FontAwesomeIcon icon={faTimes} className="h-5 w-5" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="menu hidden md:block md:w-auto " id="navbar">
          <ul className="flex md:gap-24">
            {navLinks.map((Link, index) => (
              <li key={index}>
                <NavLink href={Link.path} title={Link.title} />
              </li>
            ))}
            <Link
              className="px-4 py-1 mb-2 bg-gradient-to-br from-[#13163F] to-[#67E331] text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              href={"/"}
            >
              Back
            </Link>
          </ul>
        </div>
      </div>
      {navbarOpen ? <MenuOver links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
