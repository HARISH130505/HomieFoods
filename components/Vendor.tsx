import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ChefHat } from 'lucide-react';
import { restaurants } from '../data/restaurants';

const VendorGrid = () => {
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  const cuisines = ['all', 'indian', 'chinese', 'italian', 'thai', 'mexican'];

  const filteredRestaurants = selectedCuisine === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine.toLowerCase().includes(selectedCuisine));

  return (
    <section className="py-16 bg-yellow-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Home Chefs Near You</h2>
        <div className="flex pb-4 mb-8 gap-4">
          {cuisines.map(cuisine => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                selectedCuisine === cuisine
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-white/50'
              }`}
            >
              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((vendor) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden border border-white/10"
            >
              <div className="relative">
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center">
                  <img
                    src={vendor.chef.image}
                    alt={vendor.chef.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="ml-2">
                    <p className="font-semibold">{vendor.chef.name}</p>
                    <p className="text-sm opacity-80">{vendor.chef.specialty}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-orange-500 mb-2">{vendor.name}</h3>
                <p className="text-sm mb-4">{vendor.cuisine}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="text-yellow-400" size={16} />
                    <span className="ml-1">{vendor.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{vendor.deliveryTime} mins</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>{vendor.distance} km</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorGrid;