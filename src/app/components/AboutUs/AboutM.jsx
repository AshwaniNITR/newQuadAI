import React from 'react'

const AboutM = () => {
  return (
    <div className={`shadow-lg hover:scale-105 bg-transparent py-2 rounded-lg shadow-white my-7 p-7 md:w-[85%]`}><p className='text-lg py-2 text-transparent bg-clip-text bg-[#67E331]'>This novel AI model transforms standard 2D images into accurate 3D representations through a three-step process that begins with dehazing, enhancing clarity by removing visual noise caused by fog or poor lighting. Once clear, the images are converted into 3D models, capturing spatial depth and details, followed by a 6D pose estimation that determines both the 3D position and orientation of objects within the scene. 

    This process allows for detailed visualization across diverse environments, making it highly adaptable to conditions like low light, haze, or changing weather. The models scalability and cost-effectiveness make it a powerful tool for fields such as robotics, autonomous systems, augmented and virtual reality, and industrial automation, where precise spatial data and reliable environmental mapping are crucial for success and safety.</p></div>
  )
}

export default AboutM