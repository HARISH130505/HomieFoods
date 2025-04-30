'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Chef {
  name: string;
  image: string;
  specialty: string;
  experience: number;
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
  deliveryTime: number;
  distance: number;
  chef: Chef;
  menu: MenuItem[];
}

const ChefMenuPage = () => {
  const params = useParams();
  const id = params?.id;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:3001/restaurants/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setRestaurant(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch restaurant:', err);
          setError('Failed to load chef menu.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="bg-gray-100 py-20"><div className="max-w-7xl mx-auto text-center text-gray-600">Loading deliciousness...</div></div>;
  }

  if (error) {
    return <div className="bg-gray-100 py-20"><div className="max-w-7xl mx-auto text-center text-red-500">{error}</div></div>;
  }

  if (!restaurant) {
    return <div className="bg-gray-100 py-20"><div className="max-w-7xl mx-auto text-center text-gray-600">Restaurant not found.</div></div>;
  }

  return (
    <div className="bg-yellow-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden mb-8"
        >
          <div className="relative h-72 md:h-96">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover rounded-t-lg" style={{ objectFit: 'cover' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-orange-300 bg-white">
                <img src={restaurant.chef.image} alt={restaurant.chef.name} className="w-full h-full object-cover" style={{ objectFit: 'cover' }} />
              </div>
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold mb-1">{restaurant.chef.name}</h1>
                <p className="text-orange-200 text-sm">{restaurant.chef.specialty}</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <StatCard icon={<Star className="text-yellow-500 text-center" size={20} />} label="Rating" value={restaurant.rating} />
            <StatCard icon={<Clock className="text-blue-500 text-center" size={20} />} label="Delivery Time" value={`${restaurant.deliveryTime} min`} />
            <StatCard icon={<MapPin className="text-green-500 text-center" size={20} />} label="Distance" value={`${restaurant.distance} km`} />
            <StatCard icon={<Star className="text-purple-500 text-center" size={20} />} label="Experience" value={`${restaurant.chef.experience}`} />
          </div>

          {/* About */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About {restaurant.chef.name}</h2>
            <p className="text-gray-700 leading-relaxed">{restaurant.chef.bio}</p>
          </div>
        </motion.div>

        {/* MENU */}
        <div className="py-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Delicious Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.menu.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white md:w-[300px] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-t-lg" style={{ objectFit: 'cover' }} />
                  {item.isSpicy && <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Spicy</div>}
                  {item.isVegetarian && <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">Veg</div>}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      <span className="text-gray-700 text-sm">{item.rating}</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-3 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefMenuPage;

// Reusable Stat Card Component
const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center">
    <div className="p-3 bg-gray-100 rounded-md">{icon}</div> {/* Background for the icon */}
    <div className="ml-3">
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  </div>
);