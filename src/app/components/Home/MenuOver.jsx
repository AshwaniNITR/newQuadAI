import React from 'react'
import NavLink from './NavLink';

const MenuOver = ({links}) => {
  return (
    <ul className='flex flex-col py-6 text-2xl gap-3 items-center'>
        {links.map((Link,index)=>(
            <li key={index}>
            <NavLink href={Link.path} title={Link.title}/>
           </li>
      ))}
    </ul>
  )}

export default MenuOver;