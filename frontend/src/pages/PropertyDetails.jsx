import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  
  // Contact Form state
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setContactError("Please login to contact the owner");
      return;
    }

    setSending(true);
    setContactError('');
    setContactSuccess(false);

    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          message,
          contactPhone: user.phone || 'Not provided',
          contactEmail: user.email
        }),
      });

      if (response.ok) {
        setContactSuccess(true);
        setMessage('');
      } else {
        const data = await response.json();
        setContactError(data.message || 'Failed to send message');
      }
    } catch (err) {
      setContactError('An error occurred. Try again later.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center flex-col items-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Loading property details...</p>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center max-w-2xl mx-auto my-12">
      <h2 className="text-2xl font-bold mb-2">Error</h2>
      <p>{error}</p>
      <Link to="/properties" className="mt-6 inline-block text-indigo-600 font-medium hover:underline">
        &larr; Back to properties
      </Link>
    </div>
  );

  if (!property) return null;

  return (
    <div className="pb-12">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/properties" className="hover:text-indigo-600">Properties</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{property.title}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              For {property.listingType}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
              {property.propertyType}
            </span>
            <span className="text-gray-400 text-sm">Listed {new Date(property.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
            {property.title}
          </h1>
          <p className="text-lg text-gray-600 flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {property.address}, {property.city}
          </p>
        </div>
        <div className="text-left md:text-right bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100">
          <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">Price</p>
          <div className="text-4xl font-extrabold text-indigo-700">
            ${property.price.toLocaleString()}
            {property.listingType === 'Rent' && <span className="text-xl text-indigo-500 font-medium ml-1">/mo</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Images & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {property.images && property.images.length > 0 ? (
              <div className="relative h-[400px] md:h-[500px] w-full bg-gray-100">
                <img 
                  src={property.images[activeImage]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/40 backdrop-blur-md p-2 rounded-xl">
                    {property.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="font-medium text-lg">No Images Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <svg className="w-8 h-8 text-indigo-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Bedrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bedrooms}</span>
              </div>
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <svg className="w-8 h-8 text-indigo-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Bathrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bathrooms}</span>
              </div>
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <svg className="w-8 h-8 text-indigo-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Square Area</span>
                <span className="text-xl font-bold text-gray-900">{property.size} <span className="text-sm text-gray-500 font-medium">sqft</span></span>
              </div>
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <svg className="w-8 h-8 text-indigo-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Type</span>
                <span className="text-xl font-bold text-gray-900">{property.propertyType}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </div>
          </div>

          {/* Amenities Section */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities Showcase</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700 font-medium">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Map Placeholder */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Location Map</h2>
            <div className="h-80 bg-gray-200 rounded-2xl w-full flex flex-col justify-center items-center text-gray-500 border border-gray-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-100 pattern-grid-lg text-slate-200 opacity-50"></div>
              <svg className="w-16 h-16 text-indigo-300 mb-3 relative z-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="font-semibold text-lg text-indigo-900 relative z-10">{property.address}, {property.city}</span>
              <span className="text-sm text-indigo-600/70 mt-1 relative z-10">Interactive map integration pending</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Contact & Owner details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Contact the Owner</h3>
              <p className="opacity-80 text-sm">Fill out the form below to show interest.</p>
            </div>
            
            <div className="p-6">
              {/* Owner quick info */}
              <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                <div className="h-14 w-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold mr-4 shrink-0 uppercase">
                  {property.owner?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">{property.owner?.name || 'Property Owner'}</p>
                  <p className="text-gray-500 text-sm">{property.listingType === 'Rent' ? 'Landlord' : 'Seller'}</p>
                </div>
              </div>

              {!user ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
                  <p className="text-gray-800 mb-4 font-medium">You need an account to contact property owners.</p>
                  <Link 
                    to="/login"
                    className="block w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                  >
                    Login to connect
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {contactSuccess && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200 font-medium">
                      Message sent successfully! The owner will contact you soon.
                    </div>
                  )}
                  {contactError && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 font-medium">
                      {contactError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm"
                      placeholder={`Hi, I am interested in your property in ${property.city}...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg flex gap-2">
                    <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Your contact details (Email, Phone) will be automatically sent to the owner with this message.
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-3 px-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-md flex justify-center items-center ${sending ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {sending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
