import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-yellow-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HomieFoods</h3>
            <p className="text-gray-700">Connecting food lovers with amazing home chefs.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700">About Us</a></li>
              <li><a href="#" className="text-gray-700">Contact</a></li>
              <li><a href="#" className="text-gray-700">Become a Chef</a></li>
              <li><a href="#" className="text-gray-700">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700">Terms of Service</a></li>
              <li><a href="#" className="text-gray-700">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-700">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-700">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-700">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-700">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 py-4 bg-black text-center text-white">
          <p>&copy; 2025 HomieFoods. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;