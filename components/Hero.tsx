import React, { useState } from 'react';
import bgImage from '../public/bg.jpg';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onSearch?: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <div
        style={{ backgroundImage: `url(${bgImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="absolute inset-0 z-[-1]"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative w-full h-full px-4 flex items-center justify-center z-10">
        <motion.div
          className="w-full text-center py-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4 font-sans tracking-wide drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Experience the Future of <br /> <span className="text-yellow-300">Home Cooking</span>
          </motion.h1>

          <motion.p
            className="my-6 text-xl md:text-2xl text-gray-100 font-light drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover authentic homemade food from passionate chefs in your neighborhood
          </motion.p>

          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <input
              value={searchTerm}
              onChange={handleInputChange}
              className="bg-white/90 border-2 border-yellow-300 text-gray-800 p-4 w-[300px] md:w-[500px] lg:w-[600px] rounded-l-lg outline-none focus:border-yellow-500 transition-all duration-300"
              placeholder="Search your dream food, restaurants or more..."
            />
            <motion.div
              className="border-2 border-yellow-300 rounded-r-lg p-4 cursor-pointer bg-yellow-300 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
