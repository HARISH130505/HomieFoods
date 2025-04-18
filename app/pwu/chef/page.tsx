"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
}

const Chef = () => {
  const [kitchenName, setKitchenName] = useState('');
  const [chefName, setChefName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [chefImage, setChefImage] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});
  const [chefProfile, setChefProfile] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  const handleSaveChefProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kitchenName,
          chefName,
          specialty,
          experience,
          bio,
          chefImage
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChefProfile(data.chef);
        setRestaurantId(data.restaurant.id);
      } else {
        console.error('Failed to save chef details:', data.error);
      }
    } catch (err) {
      console.error('Error posting chef profile:', err);
    }
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.price && newItem.image && restaurantId) {
      try {
        const response = await fetch('http://localhost:3001/dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newItem.name,
            description: newItem.description || '',
            image: newItem.image,
            price: newItem.price,
            restaurantId
          })
        });

        const data = await response.json();
        if (response.ok) {
          setMenuItems([...menuItems, { ...newItem, id: data.dishId.toString() } as MenuItem]);
          setNewItem({});
          setIsAddingItem(false);
        } else {
          console.error('Failed to add item:', data.error);
        }
      } catch (err) {
        console.error('Error posting new dish:', err);
      }
    } else {
      console.warn("Please fill in all required fields (Name, Price, Image URL).");
    }
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

          {/* Chef Profile Section */}
          {!chefProfile ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 my-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Chef Profile</h2>
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
                  <div>
                    <label className="block text-gray-300 mb-2">Chef Name</label>
                    <input
                      type="text"
                      value={chefName}
                      onChange={(e) => setChefName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Specialty</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter your specialty"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter your experience"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Profile Image URL</label>
                    <input
                      type="text"
                      value={chefImage}
                      onChange={(e) => setChefImage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter image URL"
                    />
                  </div>
                  <button
                    onClick={handleSaveChefProfile}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:scale-110 cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 my-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Preview</h2>
              <div className='flex space-x-6 items-center'>
                <img
                  src={chefProfile.image}
                  alt={chefProfile.name}
                  className='w-40 h-40 rounded-full'
                />
                <div>
                    <p className="text-gray-300"><span className='text-white'>Chef's Name: </span>{chefProfile.name}</p>
                    <p className="text-gray-300"><span className='text-white'>Kitchen Name: </span>{chefProfile.kitchenName}</p>
                    <p className="text-gray-300"><span className='text-white'>Speciality: </span>{chefProfile.specialty}</p>
                    <p className="text-gray-300"><span className='text-white'>Experience: </span>{chefProfile.experience}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items Section */}
          {chefProfile && (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Menu Items</h2>
              {isAddingItem ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter item name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Price</label>
                    <input
                      type="number"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({ ...newItem, price: +e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={newItem.image || ''}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter item description"
                    />
                  </div>
                  <button
                    onClick={handleAddItem}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:scale-110 cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md mr-4" />
                        <h4 className="text-white">{item.name}</h4>
                        <p className="text-gray-300">{item.description}</p>
                        <p className="text-yellow-500 flex items-center"><IndianRupee className='w-4 h-4'/>{item.price}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:scale-110 cursor-pointer mt-4"
                  >
                    <Plus className="inline-block mr-2" /> Add New Item
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Chef;