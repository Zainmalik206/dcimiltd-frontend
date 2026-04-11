import React from 'react';
import { Search, Heart, User, ShoppingCart, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-sm py-2 px-4">
        Free shipping on all orders over $50! Limited time offer.
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="text-2xl font-bold text-gray-900 flex items-center">
            <img src="/images/logo.png" alt="E-Shop Logo" className="h-8 mr-2" /> {/* Replace with your logo */}
            E-Shop
          </a>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-grow max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Navigation & Icons */}
        <nav className="flex items-center space-x-6">
          {/* Main Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 font-medium text-gray-700">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="/shop" className="hover:text-blue-600 transition-colors">Shop</a>
            <a href="/categories" className="hover:text-blue-600 transition-colors">Categories</a>
            <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors relative">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <User size={20} />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">5</span>
            </button>
            {/* Mobile Menu Icon */}
            <button className="lg:hidden text-gray-600 hover:text-blue-600 transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Search Bar (Mobile) - Appears below main header on small screens */}
      <div className="lg:hidden px-4 sm:px-6 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;