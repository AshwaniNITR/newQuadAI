"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import Image from "next/image";


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
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e2a]/80 backdrop-blur-lg border-b border-[#67E331]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/Images/hexad.png"
                  alt="Hexadepth Logo"
                  width={65}
                  height={45}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <NavLink 
                  key={index} 
                  href={link.path} 
                  title={link.title}
                  className="relative group text-[#c4d6ff] hover:text-[#67E331] transition-colors duration-300"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#67E331] transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}
              <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#13163F] to-[#67E331] text-white font-medium
                          hover:from-[#67E331] hover:to-[#13163F] shadow-md hover:shadow-[#67E331]/40 transition-all duration-300"
              >
                Back
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#c4d6ff] hover:text-[#67E331] focus:outline-none
                        hover:bg-[#13163F]/50 transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!navbarOpen ? (
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
                  className="h-6 w-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              ) : (
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
                  className="h-6 w-6"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {navbarOpen && (
        <div className="md:hidden bg-[#13163F]/90 backdrop-blur-lg border-t border-[#67E331]/20 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#c4d6ff] hover:text-[#67E331] hover:bg-[#13163F]/50 transition-colors duration-300"
                onClick={() => setNavbarOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-[#13163F] to-[#67E331] mt-2"
              onClick={() => setNavbarOpen(false)}
            >
              Back
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;