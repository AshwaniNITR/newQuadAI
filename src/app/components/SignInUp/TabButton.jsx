"use client"
import React from 'react'
const TabButton = ({active,selectTab,children}) => {
    const buttonClass=active ?
     "text-white bg-gradient-to-br from-[#549EB8] to-[#948534] rounded-lg p-5"
     :"text-transparent bg-clip-text bg-[#948534]";
  return (
    <button onClick={selectTab}>
    <div className={`my-3 text-xl md:text-3xl font-bold  hover:text-white ${buttonClass}`}>
        {children}
    </div>  
    </button>
  )
}

export default TabButton