"use client";
import { motion } from "framer-motion";
import { ChefHat, Bike } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const Partner = () => {
  const { openSignIn } = useClerk();

  const handleSignIn = (role: "chef" | "delivery") => {
    openSignIn({
      redirectUrl: `/pwu/${role}`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-800 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Partner with HomieFoods</h1>
          <p className="text-xl text-gray-300">
            Join our growing community of chefs and delivery partners
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Chef Partner Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/10"
          >
            <ChefHat className="text-yellow-500 w-16 h-16 mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-4">Become a Chef Partner</h2>
            <p className="text-gray-300 mb-6">
              Share your culinary creations with food lovers in your area. Set your own menu, prices.
            </p>
            <ul className="text-gray-300 mb-8 text-left space-y-2">
              <li>• Create your virtual kitchen</li>
              <li>• Showcase your signature dishes</li>
              <li>• Earn money doing what you love</li>
              <li>• Access order management tools</li>
            </ul>
            <button
              onClick={() => handleSignIn("chef")}
              className="block w-full bg-yellow-500 text-black text-center py-3 rounded-lg hover:scale-110 transition-transform"
            >
              Login as Chef
            </button>
          </motion.div>

          {/* Delivery Partner Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/10"
          >
            <Bike className="text-yellow-500 w-16 h-16 mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-4">Become a Delivery Partner</h2>
            <p className="text-gray-300 mb-6">
              Join our delivery network and earn money on your own schedule. Be your own boss.
            </p>
            <ul className="text-gray-300 mb-8 text-left space-y-2">
              <li>• Flexible working hours</li>
              <li>• Choose your delivery area</li>
              <li>• Earn competitive rates</li>
              <li>• Get paid weekly</li>
            </ul>
            <button
              onClick={() => handleSignIn("delivery")}
              className="block w-full bg-yellow-500 text-black text-center py-3 rounded-lg hover:scale-110 transition-transform"
            >
              Login as Delivery Partner
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
