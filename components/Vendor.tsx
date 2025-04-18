'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star } from 'lucide-react';

interface Chef {
  name: string;
  image: string;
  specialty: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisines: string;
  image: string;
  rating: number;
  deliveryTime: number;
  distance: number;
  chef: Chef;
}

const VendorGrid = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cuisines = ['all', 'indian', 'chinese', 'italian', 'thai', 'fusion'];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('http://localhost:3001/restaurants');
        const data = await res.json();
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants =
    selectedCuisine === 'all'
      ? restaurants
      : restaurants.filter((r) =>
          r.cuisines.toLowerCase().includes(selectedCuisine.toLowerCase())
        );

  return (
    <section className="py-16 bg-yellow-600 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Home Chefs Near You</h2>

        <div className="flex pb-4 mb-8 gap-4 flex-wrap">
          {cuisines.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-6 py-2 rounded-full ${
                selectedCuisine === cuisine
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-white/80'
              }`}
            >
              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <p className="text-white text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-200">{error}</p>
        ) : filteredRestaurants.length === 0 ? (
          <p className="text-white">No restaurants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg overflow-hidden border border-white/10 shadow-md"
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
                    <div className="ml-2 text-white">
                      <p className="font-semibold">{vendor.chef.name}</p>
                      <p className="text-sm opacity-80">{vendor.chef.specialty}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-orange-500 mb-2">
                    {vendor.name}
                  </h3>
                  <p className="text-sm mb-4 capitalize">{vendor.cuisines}</p>

                  <div className="flex items-center justify-between text-sm text-gray-700">
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
        )}
      </div>
    </section>
  );
};

export default VendorGrid;