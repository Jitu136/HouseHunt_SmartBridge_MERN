import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?location=${searchTerm}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-indigo-900 text-white shadow-2xl">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Beautiful Home"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Find Your Dream <br/>
              <span className="text-indigo-400">Home Today</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl">
              HouseHunt simplifies the process of finding, renting, buying, and selling properties. Explore thousands of listings with ease and confidence.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, neighborhood, or address..."
                className="flex-grow min-w-0 px-5 py-4 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-900 duration-200 transform hover:-translate-y-1"
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="mt-2 text-gray-600">Explore some of our most beautiful listings across the country.</p>
          </div>
          <button 
            onClick={() => navigate('/properties')}
            className="hidden sm:inline-block text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            View all properties &rarr;
          </button>
        </div>
        
        {/* Placeholder for PropertyGrid, we will build this component later */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
            >
              <div className="h-48 bg-gray-200 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center text-gray-400">
                  Loading Image...
                </div>
              </div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-6"></div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
