"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Paneer Butter Masala",
      price: 120,
      quantity: 1,
      image: "https://media.istockphoto.com/id/1349771241/photo/indian-food-kadai-paneer.jpg?s=612x612&w=0&k=20&c=TD4ssNLlzbW2zRqHfilAMpYk01tVwnysKjngTDeFiD4="
    },
    {
        id: 2,
        name: "Chicken Biryani",
        price: 200,
        quantity: 1,
        image: "https://media.istockphoto.com/id/1333127665/photo/chicken-biryani-spicy-indian-malabar-biryani-hyderabadi-biryani-dum-biriyani-pulao-golden.jpg?s=612x612&w=0&k=20&c=63UXYPOISm8nJ8SNK79dDm0w1gY6jXzYQP0heL6fnOg="
    },

  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cartElement = cartRef.current;
    if (cartElement) {
      cartElement.addEventListener('wheel', (event) => {
        event.preventDefault();
        cartElement.scrollLeft += event.deltaY;
      }, { passive: false });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
          <div
            ref={cartRef}
            className="max-h-[500px] overflow-y-auto rounded-md shadow-lg"
          >
            <div className="space-y-4 p-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-4 flex items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p>${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 cursor-pointer hover:text-gray-400"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 cursor-pointer hover:text-gray-400"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                      className="p-1 cursor-pointer text-red-400 hover:text-red-300 ml-4"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 sticky top-24">
            <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between  font-bold">
                  <span>Total</span>
                  <span>${(total + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 cursor-pointer"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;