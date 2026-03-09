import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  
  // Listings State
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  
  // Messages State
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setName(user.name || '');
    setPhone(user.phone || '');
    
    if (activeTab === 'listings' && ['Landlord/Seller', 'Agent'].includes(user.role)) {
      fetchListings();
    } else if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [user, navigate, activeTab]);

  const fetchListings = async () => {
    setListingsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const res = await fetch('http://localhost:5000/api/users/my-listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const res = await fetch('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: 'Updating...', type: 'info' });
    
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const body = { name, phone };
      if (password) body.password = password;
      
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (res.ok) {
        data.token = token; // Preserve token
        login(data);
        setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
        setPassword('');
      } else {
        setProfileMsg({ text: data.message || 'Error updating profile', type: 'error' });
      }
    } catch (err) {
      setProfileMsg({ text: 'Network error', type: 'error' });
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          setListings(listings.filter(item => item._id !== id));
        } else {
          alert('Failed to delete property');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) return null;

  const isOwner = ['Landlord/Seller', 'Agent'].includes(user.role);

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your account and properties</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs Grid */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            My Profile
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'messages' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Messages
          </button>
          
          {isOwner && (
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'listings' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              My Properties
            </button>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center mb-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-5">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-indigo-600 font-medium">{user.role}</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {profileMsg.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium border ${
                      profileMsg.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                      profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {profileMsg.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
                      value={user.email}
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Inbox & Sent Messages</h2>
                
                {messagesLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No messages found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isReceived = msg.receiver && msg.receiver._id === user._id;
                      
                      return (
                        <div key={msg._id} className={`p-5 rounded-2xl border ${isReceived ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-gray-200'} shadow-sm flex flex-col md:flex-row gap-4`}>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md mb-1 ${isReceived ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                  {isReceived ? 'Received' : 'Sent'}
                                </span>
                                <h4 className="font-bold text-gray-900">
                                  {isReceived ? `From: ${msg.sender?.name || 'Unknown'}` : `To: ${msg.receiver?.name || 'Unknown'}`}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-500 whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            <Link to={`/property/${msg.property?._id}`} className="text-indigo-600 text-sm font-medium hover:underline mb-3 inline-block">
                              Regarding: {msg.property?.title || 'Property'}
                            </Link>
                            
                            <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-100">{msg.message}</p>
                          </div>
                          
                          {isReceived && (
                            <div className="md:w-64 bg-white p-4 rounded-xl border border-gray-100 h-max flex flex-col gap-2 shrink-0">
                              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Sender Details</h5>
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <a href={`mailto:${msg.contactEmail}`} className="hover:text-indigo-600">{msg.contactEmail}</a>
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                {msg.contactPhone}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* LISTINGS TAB */}
            {activeTab === 'listings' && isOwner && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Property Portfolio</h2>
                  <Link 
                    to="/add-property" 
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>Add New Property</span>
                  </Link>
                </div>
                
                {listingsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-500 mb-6">Start listing your properties for rent or sale today.</p>
                    <Link to="/add-property" className="text-indigo-600 font-bold hover:underline">Add property &rarr;</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listings.map(property => (
                      <div key={property._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-indigo-200 transition-colors">
                        <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-gray-200 flex-shrink-0 relative">
                          <img src={property.images[0] || 'https://via.placeholder.com/300'} alt={property.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs">
                            {property.listingType}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              <Link to={`/property/${property._id}`}>{property.title}</Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{property.city}</p>
                            <p className="font-extrabold text-indigo-700">${property.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex justify-start space-x-3 mt-4 pt-4 border-t border-gray-100">
                            {/* Use Link instead of navigate for edit to keep it simple, or navigate */}
                            <Link 
                              to={`/edit-property/${property._id}`}
                              className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteProperty(property._id)}
                              className="px-4 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
