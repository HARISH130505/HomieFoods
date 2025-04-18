import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, IndianRupee } from 'lucide-react';

interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  is_spicy: boolean;
  restaurant: string;
  chef_name: string;
}

interface DishesProps {
  searchTerm?: string;
}

const Dishes: React.FC<DishesProps> = ({ searchTerm = '' }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3001/dishes')
      .then((res) => res.json())
      .then((data: Dish[]) => {
        setDishes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dishes:', err);
        setLoading(false);
      });
  }, []);

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.chef_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-16 text-white text-center">
        <p>Loading dishes...</p>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-amber-950" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Homemade Dishes</h2>

        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  {dish.is_spicy ? (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <Flame size={16} className="text-white" />
                    </div>
                  ):""}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{dish.name}</h3>
                  <p className="text-sm text-orange-500">by {dish.chef_name}</p>
                  <p className="text-sm mt-1">{dish.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="text-yellow-400" size={16} />
                      <span className="ml-1">{dish.rating}</span>
                    </div>
                    <span className="text-lg font-bold flex items-center">
                      <IndianRupee className="h-4 w-4" />{dish.price}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full py-2 bg-yellow-500 rounded-2xl cursor-pointer"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-white text-lg">
            No dishes found for "<span className="font-semibold">{searchTerm}</span>".
          </p>
        )}
      </div>
    </section>
  );
};

export default Dishes;
