"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const Chef = () => {
  const [kitchenName, setKitchenName] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.image) {
      setMenuItems([...menuItems, { ...newItem, id: Date.now().toString() } as MenuItem]);
      setNewItem({});
      setIsAddingItem(false);
    } else {
      console.warn("Please fill in all required fields (Name, Price, Image URL).");
    }
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-orange-800 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Chef Dashboard</h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Kitchen Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Kitchen Name</label>
                <input
                  type="text"
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter your kitchen name"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Menu Items</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingItem(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Item
              </motion.button>
            </div>

            {isAddingItem && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-black"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Price</label>
                    <input
                      type="number"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newItem.image || ''}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsAddingItem(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg text-black hover:scale-110 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:scale-110 cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-300">${item.price}</p>
                    {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md mt-2" />}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-gray-300 hover:text-white"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
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

export default Chef;