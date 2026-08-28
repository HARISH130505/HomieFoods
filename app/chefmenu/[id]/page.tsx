'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star, Clock, MapPin, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { endpoints } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { restaurants as localMockRestaurants } from '@/data/restaurants';

interface Chef {
  name: string;
  image: string;
  specialty: string;
  experience: number | string;
  bio: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: number | string;
  distance: number | string;
  chef: Chef;
  menu: MenuItem[];
}

const ChefMenuPage = () => {
  const params = useParams();
  const id = params?.id;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(endpoints.restaurantById(id as string))
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data && data.name) {
            setRestaurant(data);
          } else {
            throw new Error('Invalid restaurant payload');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Backend restaurant fetch failed, falling back to local dataset:', err.message);
          const found = localMockRestaurants.find((r) => String(r.id) === String(id)) || localMockRestaurants[0];
          if (found) {
            setRestaurant({
              id: found.id,
              name: found.name,
              image: found.image === '/placeholder.png' ? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800' : found.image,
              rating: found.rating,
              deliveryTime: found.deliveryTime,
              distance: found.distance,
              chef: {
                name: found.chef.name,
                image: found.chef.image === '/placeholder.png' ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200' : found.chef.image,
                specialty: found.chef.specialty,
                experience: found.chef.experience,
                bio: found.chef.bio,
              },
              menu: found.menu.map((m) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                image: m.image,
                price: m.price,
                rating: m.rating,
                isSpicy: m.isSpicy,
              })),
            });
          }
          setLoading(false);
        });
    }
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    if (!restaurant) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      chef_name: restaurant.chef.name,
      restaurant: restaurant.name,
      description: item.description,
    });
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId((current) => (current === item.id ? null : current));
    }, 1500);
  };

  if (loading) {
    return (
      <div className="bg-amber-950 min-h-screen py-24 text-center text-amber-200">
        <p className="text-xl animate-pulse">Loading delicious homemade kitchen menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-amber-950 min-h-screen py-24 text-center text-white">
        <p className="text-xl mb-4">Chef kitchen not found.</p>
        <Link href="/" className="inline-flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-amber-300 hover:text-white mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} className="mr-1.5" /> Back to all home chefs
        </Link>

        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-3xl overflow-hidden mb-12 border border-amber-200/40"
        >
          <div className="relative h-72 md:h-96">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex items-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-yellow-400 bg-white shadow-lg">
                  <img
                    src={restaurant.chef.image}
                    alt={restaurant.chef.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 text-white">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Verified Home Chef
                  </span>
                  <h1 className="text-2xl md:text-4xl font-extrabold mt-1">{restaurant.name}</h1>
                  <p className="text-amber-200 text-sm font-medium">Chef {restaurant.chef.name} • {restaurant.chef.specialty}</p>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-amber-300 text-xs font-semibold border border-amber-500/30">
                ✨ Cash on Delivery (COD) Available
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-amber-50/50 border-b border-amber-100">
            <StatCard icon={<Star className="text-amber-500 fill-amber-500" size={20} />} label="Customer Rating" value={`${restaurant.rating} ★`} />
            <StatCard icon={<Clock className="text-blue-500" size={20} />} label="Delivery Time" value={`${restaurant.deliveryTime} mins`} />
            <StatCard icon={<MapPin className="text-emerald-500" size={20} />} label="Distance" value={`${restaurant.distance} km`} />
            <StatCard icon={<Star className="text-purple-500" size={20} />} label="Experience" value={restaurant.chef.experience || '5+ years'} />
          </div>

          {/* About */}
          <div className="px-6 py-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-2">About Chef {restaurant.chef.name}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{restaurant.chef.bio}</p>
          </div>
        </motion.div>

        {/* MENU */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Fresh Kitchen Menu</h2>
              <p className="text-amber-200 text-sm mt-1">Made to order with hand-picked ingredients</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurant.menu?.map((item) => {
              const isJustAdded = addedItemId === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {item.isSpicy && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        Spicy 🌶️
                      </div>
                    )}
                    {item.isVegetarian && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        Pure Veg 🌱
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded">
                          <Star className="text-amber-500 fill-amber-500 mr-1" size={14} />
                          <span className="text-gray-800 text-xs font-bold">{item.rating || 4.8}</span>
                        </div>
                        <span className="text-xl font-extrabold text-gray-900">₹{item.price}</span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer ${
                          isJustAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {isJustAdded ? (
                            <motion.span
                              key="added"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-1"
                            >
                              <Check size={16} />
                              <span>Added to Cart!</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="add"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-1"
                            >
                              <ShoppingBag size={16} />
                              <span>Add to Cart</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefMenuPage;

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center p-2 rounded-xl">
    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-amber-100">{icon}</div>
    <div className="ml-3">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-xs font-medium">{label}</p>
    </div>
  </div>
);