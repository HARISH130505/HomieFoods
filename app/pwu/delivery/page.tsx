"use client"
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, IndianRupee } from 'lucide-react';

const orders = [
  {
    id: '1',
    customer: 'Harish',
    address: '123 Main St,Madipakkam',
    items: ['Biryani', 'Naan'],
    total: 300,
    status: 'pending'
  },
];

const Delivery= () => {
  return (
    <div className="min-h-screen bg-orange-800 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Delivery Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <Package className="text-yellow-500 mb-2" size={24} />
              <h3 className="text-lg font-semibold text-white">Available Orders</h3>
              <p className="text-2xl text-yellow-500">5</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <Clock className="text-yellow-500 mb-2" size={24} />
              <h3 className="text-lg font-semibold text-white">Active Deliveries</h3>
              <p className="text-2xl text-yellow-500">2</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <IndianRupee className="text-yellow-500 mb-2" size={24} />
              <h3 className="text-lg font-semibold text-white">Today's Earnings</h3>
              <p className="text-2xl text-yellow-500 flex items-center"><IndianRupee/>45.50</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Incoming Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-300">{order.customer}</p>
                    </div>
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300 mb-2">
                    <MapPin size={16} />
                    {order.address}
                  </div>
                  <div className="text-gray-300 mb-4">
                    Items: {order.items.join(', ')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-500 font-semibold flex items-center">
                    <IndianRupee className='h-4'/>{order.total}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-500 text-black px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Accept Order
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Delivery;