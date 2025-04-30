'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';

interface Vendor {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: number;
  distance: number;
  cuisines: string;
  chef: {
    name: string;
    image: string;
    specialty: string;
  };
}

const VendorGrid = () => {
  const [restaurants, setRestaurants] = useState<Vendor[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
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

  const cuisines = ['all', 'indian', 'chinese', 'italian', 'thai', 'fusion'];

  const filteredRestaurants =
    selectedCuisine === 'all'
      ? restaurants
      : restaurants.filter((r) =>
          r.cuisines.toLowerCase().includes(selectedCuisine.toLowerCase())
        );

  return (
    <section className="py-12 bg-yellow-600 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Home Chefs Near You</h2>
        <div className="flex pb-6 mb-8 gap-3 sm:gap-4 flex-wrap">
          {cuisines.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                selectedCuisine === cuisine
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg animate-pulse">Loading delicious options...</p> 
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white">No home chefs found for the selected cuisine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((vendor) => (
              <Link key={vendor.id} href={`/chefmenu/${vendor.id}`} className="block"> 
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300" 
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
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="ml-3 text-white"> 
                        <p className="font-semibold text-lg">{vendor.chef.name}</p>
                        <p className="text-sm opacity-80">{vendor.chef.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-orange-500 mb-1">{vendor.name}</h3> 
                    <p className="text-gray-600 text-sm mb-3 capitalize">{vendor.cuisines}</p> 

                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={16} />
                        <span>{vendor.rating}</span>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VendorGrid;