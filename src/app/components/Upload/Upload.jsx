import React from 'react'
import '../SignInUp/Sign.css';

const Upload = () => {
  return (
    <div className='bg-[#13163F] py-8' id='Upload'> 
       <h1 className='fade-in-up text-center pt-0 text-4xl sm:text-5xl lg:text-6xl mt-0 text-transparent bg-clip-text bg-gradient-to-br from-[#13163F] to-[#67E331] font-extrabold'>
       Upload Images
      </h1>
       <form className="w-[80%] fade-in-right mx-auto p-6 pb-6 mt-5 bg-white shadow-md rounded-md">
       <div className="mb-4">
    <label htmlFor="first-name" className="block text-gray-700 font-bold mb-2">
      First Name
    </label>
    <input
      type="text"
      id="first-name"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your first name"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="second-name" className="block text-gray-700 font-bold mb-2">
      Second Name
    </label>
    <input
      type="text"
      id="second-name"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your second name"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
      Email
    </label>
    <input
      type="email"
      id="email"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your email"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="phone-number" className="block text-gray-700 font-bold mb-2">
      Phone Number
    </label>
    <input
      type="tel"
      id="phone-number"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your phone number"
    />
  </div>

  <div className="mb-4 ">
    <label htmlFor="upload-images" className="block text-gray-700 font-bold mb-2">
      Upload Images
    </label>
    <div className='grid grid-cols-2 gap-4'>
    <input
      type="file"
      id="upload-images"
      className="w-full"
      multiple
      accept="image/*"
    />
    <input
      type="file"
      id="upload-images"
      className="w-full"
      multiple
      accept="image/*"
    />
    <input
      type="file"
      id="upload-images"
      className="w-full"
      multiple
      accept="image/*"
    />
    <input
      type="file"
      id="upload-images"
      className="w-full"
      multiple
      accept="image/*"
    /></div>
    <p className="text-sm text-gray-500 mt-1">Upload up to 4 images</p>
  </div>

  <button
    type="submit"
    className="w-full  bg-gradient-to-br from-[#13163F] to-[#67E331] text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300  font-bold py-2 px-4 "
  >
    Submit
  </button>
</form>

    </div>
  )
}

export default Upload