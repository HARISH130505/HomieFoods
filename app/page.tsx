import React from 'react';
import bgImage from '../public/bg.jpg';
import { Search } from 'lucide-react';

const page = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div
        style={{ backgroundImage: `url(${bgImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="absolute inset-0 opacity-50"
      ></div>
      <div className="relative w-full min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[800px]">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center text-">
            Homemade foodies where memories are made and seconds are mandatory
          </h1>
          <div className='flex items-center'>
          <input
            className="bg-white border-2 border-amber-900 text-black p-4 w-full rounded-md outline-0"
            placeholder="Search your dream food, restaurants or more..."
          />
          <div className='bg-white border-2 rounded-md p-4 border-amber-900'>
          <Search/>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;