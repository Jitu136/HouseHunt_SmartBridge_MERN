import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col h-full hover:shadow-xl transition-all duration-300"
    >
      <div className="h-56 bg-gray-200 relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-slate-100 flex items-center justify-center text-indigo-300 font-medium">
            HouseHunt Listing
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
          ${property.price.toLocaleString()}
          {property.listingType === 'Rent' && <span className="text-xs text-gray-500 font-normal">/mo</span>}
        </div>
        <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          {property.listingType}
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
          {property.propertyType}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">{property.title}</h3>
        <p className="text-gray-500 text-sm mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="truncate">{property.address}, {property.city}</span>
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4 mt-auto mb-5">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg mb-0.5">{property.bedrooms}</span> 
            <span className="text-xs text-gray-400 uppercase tracking-wider">Beds</span>
          </div>
          <div className="h-8 border-l border-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg mb-0.5">{property.bathrooms}</span> 
            <span className="text-xs text-gray-400 uppercase tracking-wider">Baths</span>
          </div>
          <div className="h-8 border-l border-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg mb-0.5">{property.size}</span> 
            <span className="text-xs text-gray-400 uppercase tracking-wider">Sq Ft</span>
          </div>
        </div>
        
        <Link 
          to={`/property/${property._id}`}
          className="block w-full text-center py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-sm"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
