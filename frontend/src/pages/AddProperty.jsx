import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // URL parameter for Edit mode
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    listingType: 'Rent',
    propertyType: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    size: '',
    images: '',
    amenities: '',
  });

  useEffect(() => {
    if (!user || !['Landlord/Seller', 'Agent'].includes(user.role)) {
      navigate('/dashboard');
    }

    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/properties/${id}`);
          if (res.ok) {
            const data = await res.json();
            
            // Check authorization
            if (data.owner._id !== user._id && data.owner !== user._id) {
              navigate('/dashboard');
              return;
            }
            
            setFormData({
              ...data,
              images: data.images.join(', '),
              amenities: data.amenities.join(', '),
            });
          }
        } catch (err) {
          setError('Failed to fetch property details');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchProperty();
    }
  }, [user, navigate, id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process comma separated lists
      const processedData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
        contactPhone: user.phone || '000-000-0000',
        images: formData.images.split(',').map(img => img.trim()).filter(img => img), // Default logic for arrays
        amenities: formData.amenities.split(',').map(itm => itm.trim()).filter(itm => itm)
      };

      // Fallback if no image provided
      if (processedData.images.length === 0) {
        processedData.images = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'];
      }

      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      
      const url = isEditMode 
        ? `http://localhost:5000/api/properties/${id}` 
        : 'http://localhost:5000/api/properties';
        
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      if (res.ok) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to save property');
      }
    } catch (err) {
      setError('An error occurred. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white">
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="opacity-80 mt-2">Fill in the details to list your property on HouseHunt.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Apartment with Ocean View"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                    <select
                      name="listingType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      value={formData.listingType}
                      onChange={handleChange}
                    >
                      <option value="Rent">Rent</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      name="propertyType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. New York"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Details & Features */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Features & Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (Sq Ft)</label>
                <input
                  type="number"
                  name="size"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, Pool, AC, Furnished..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Media */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Photos</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
              <textarea
                name="images"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://image1.jpg, https://image2.jpg..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Provide direct links to property images. In a production app, this would be a file upload component.</p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition flex items-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isEditMode ? 'Update Property' : 'List Property'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProperty;
