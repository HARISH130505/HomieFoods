import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame, IndianRupee, Check, ShoppingBag } from 'lucide-react';
import { endpoints } from '@/lib/api';
import { useCart } from '@/context/CartContext';

interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  is_spicy?: boolean;
  restaurant?: string;
  chef_name?: string;
}

interface DishesProps {
  searchTerm?: string;
}

const fallbackDishes: Dish[] = [
  {
    id: 1,
    name: 'Masala Dosa',
    description: 'Crispy golden crepe filled with fragrant spiced potato masala, served with coconut chutney and sambar.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    price: 60,
    is_spicy: false,
    restaurant: 'Home Kitchen',
    chef_name: 'Venkatesh Bhatt',
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    description: 'Fresh cottage cheese cubes simmered in a rich, velvety tomato and butter gravy.',
    image: 'https://media.istockphoto.com/id/1349771241/photo/indian-food-kadai-paneer.jpg?s=612x612&w=0&k=20&c=TD4ssNLlzbW2zRqHfilAMpYk01tVwnysKjngTDeFiD4=',
    rating: 4.8,
    price: 120,
    is_spicy: false,
    restaurant: 'Home Kitchen',
    chef_name: 'Venkatesh Bhatt',
  },
  {
    id: 3,
    name: 'Medu Vada',
    description: 'Crispy lentil fritters with a fluffy interior, paired with traditional sambar and podi.',
    image: 'https://media.istockphoto.com/id/666724754/photo/medu-vada-vadai-south-indian-snack.jpg?s=612x612&w=0&k=20&c=ikZigYYu8glS2gEtHcQPUnJGFxsB5CFS6FtNkEilPM8=',
    rating: 4.7,
    price: 30,
    is_spicy: false,
    restaurant: "Daamu's Kitchen",
    chef_name: 'Chef Daamu',
  },
  {
    id: 4,
    name: 'Chicken Dum Biryani',
    description: 'Slow-cooked aromatic basmati rice infused with whole spices, saffron, and tender marinated chicken.',
    image: 'https://media.istockphoto.com/id/1333127665/photo/chicken-biryani-spicy-indian-malabar-biryani-hyderabadi-biryani-dum-biriyani-pulao-golden.jpg?s=612x612&w=0&k=20&c=63UXYPOISm8nJ8SNK79dDm0w1gY6jXzYQP0heL6fnOg=',
    rating: 4.9,
    price: 220,
    is_spicy: true,
    restaurant: "Daamu's Kitchen",
    chef_name: 'Chef Daamu',
  },
];

const Dishes: React.FC<DishesProps> = ({ searchTerm = '' }) => {
  const [dishes, setDishes] = useState<Dish[]>(fallbackDishes);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedDishId, setAddedDishId] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(endpoints.dishes)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: Dish[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDishes(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend unavailable, utilizing cached mock dishes:', err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (dish: Dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      chef_name: dish.chef_name,
      restaurant: dish.restaurant,
      description: dish.description,
    });
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId((current) => (current === dish.id ? null : current));
    }, 1500);
  };

  const filteredDishes = dishes.filter((dish) =>
    (dish.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dish.chef_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dish.restaurant || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 relative overflow-hidden bg-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Popular Homemade Dishes</h2>
            <p className="text-amber-200/80 text-sm mt-1">
              Freshly prepared by neighborhood chefs using healthy, authentic home recipes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-amber-200 animate-pulse">
            <p>Loading hot & fresh dishes...</p>
          </div>
        ) : filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => {
              const isJustAdded = addedDishId === dish.id;
              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-amber-100 flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-48 object-cover"
                    />
                    {dish.is_spicy && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold flex items-center shadow-md">
                        <Flame size={14} className="mr-0.5 fill-white" /> Spicy
                      </div>
                    )}
                    {dish.restaurant && (
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md">
                        {dish.restaurant}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">{dish.name}</h3>
                      {dish.chef_name && (
                        <p className="text-xs font-semibold text-orange-600 mt-0.5">
                          by {dish.chef_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                          <Star className="text-amber-500 fill-amber-500" size={14} />
                          <span className="ml-1 text-xs font-bold text-amber-900">
                            {dish.rating || 4.8}
                          </span>
                        </div>
                        <span className="text-lg font-extrabold text-gray-900 flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {dish.price}
                        </span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleAddToCart(dish)}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer ${isJustAdded
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
        ) : (
          <div className="text-center py-12 bg-amber-900/30 rounded-2xl border border-amber-800">
            <p className="text-amber-200 text-lg">
              No dishes found matching "<span className="font-semibold text-white">{searchTerm}</span>".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dishes;

