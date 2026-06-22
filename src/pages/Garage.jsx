import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import heroImg from '../assets/hero.png';

const API_IMG = 'http://localhost:8000';

export default function Garage() {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        const [productsRes, wishlistRes, eventsRes] = await Promise.all([
          axiosInstance.get('/products/my'),
          axiosInstance.get('/wishlist'),
          axiosInstance.get('/ride-events/upcoming')
        ]);
        
        setMyProducts(productsRes.data?.data?.products || []);
        setWishlist(wishlistRes.data?.data?.wishlist || []);
        setUpcomingEvents(eventsRes.data?.data?.events || []);
      } catch (err) {
        console.error('Error fetching garage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGarageData();
  }, []);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axiosInstance.delete(`/products/${productToDelete}`);
      // Remove from UI
      setMyProducts((prev) => prev.filter((p) => p._id !== productToDelete));
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete the product.');
      setProductToDelete(null);
    }
  };

  const getImg = (item) => {
    const url = item?.images?.[0]?.url || item?.imageCover;
    if (!url) return img1;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${API_IMG}${url}`;
    return `${API_IMG}/uploads/products/${url}`;
  };

  const getUserImg = (usr) => {
    if (!usr?.profileImage) return null;
    let imgPath = usr.profileImage;
    if (!imgPath.includes('.')) {
      imgPath += '.jpg';
    }
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_IMG}/uploads/users/${imgPath}`;
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        {/* ══════════ Top Hero Section ══════════ */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 md:pt-6">
          <div className="relative w-full h-[180px] md:h-[250px] rounded-2xl md:rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
            <img src={user?.coverImage ? (user.coverImage.startsWith('http') ? user.coverImage : `${API_IMG}/uploads/users/${user.coverImage}`) : heroImg} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
          
        {/* User Profile Info */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center text-center md:text-left md:items-end gap-4 md:gap-6 relative z-10 pb-6 md:pb-8 border-b border-white/5 pt-2">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#0a0e1a] bg-[#0f1629] overflow-hidden flex-shrink-0 relative -mt-16 md:-mt-20">
            {user?.profileImage ? (
              <img 
                src={getUserImg(user)} 
                alt={user.name} 
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                className="w-full h-full object-cover" 
              />
            ) : null}
            <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-500 bg-gray-800" style={{ display: user?.profileImage ? 'none' : 'flex' }}>
              {(user?.name?.charAt(0) || 'U').toUpperCase()}
            </div>
            {user?.isVerified && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-900 text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap shadow-md">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </div>
            )}
          </div>
          
          <div className="flex-1 md:mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{user?.name || 'Rider One'}</h1>
            <p className="text-[11px] md:text-xs text-gray-400 font-semibold mb-2 md:mb-3">
              {user?.rank || (user?.role === 'admin' ? 'Administrator' : 'New Rider')} • Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
            </p>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed mx-auto md:mx-0">
              {user?.bio || 'Pushing limits across the European Alps. Tech lead by day, track enthusiast by weekend. Currently tuning a 2023 Panigale V4 for the upcoming seasonal tour.'}
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 md:mb-2">
            <Link to="/profile" className="flex-1 md:flex-none px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ══════════ Left Column (Stats & Upcoming Rides) ══════════ */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Rider Stats */}
              <div className="bg-[#121622] rounded-2xl p-5 border border-white/5">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-5">Rider Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-base md:text-lg font-bold text-white truncate" title={user?.location || 'N/A'}>{user?.location || 'N/A'}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Bike Type</p>
                    <p className="text-base md:text-lg font-bold text-white truncate" title={user?.bikeType || 'N/A'}>{user?.bikeType || 'N/A'}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Followers</p>
                    <p className="text-xl font-bold text-cyan-400">{user?.followersCount || 0}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Following</p>
                    <p className="text-xl font-bold text-cyan-400">{user?.followingCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Rides */}
              <div className="bg-[#121622] rounded-2xl p-5 border border-white/5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Upcoming Rides</h3>
                  <Link to="/ride-events" className="text-[11px] font-bold text-blue-400 hover:text-cyan-400">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map(event => (
                      <Link to={`/ride-events/${event._id}`} key={event._id} className="flex gap-3 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                          <img src={event.coverImage ? (event.coverImage.startsWith('http') ? event.coverImage : `${API_IMG}/uploads/ride-events/${event.coverImage}`) : img1} onError={(e) => { e.target.src = img1; }} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white leading-tight truncate group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.participantsCount || 0} Riders
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase">{event.type || 'Ride'}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No upcoming events.</p>
                  )}
                </div>
              </div>
            </div>

            {/* ══════════ Right Column (The Garage & Wishlist) ══════════ */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* The Garage */}
              <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">The Garage</h2>
                  <Link to="/sell-bike" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : myProducts.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-400 text-sm mb-3">You haven't listed any machines yet.</p>
                    <Link to="/sell-bike" className="text-sm font-semibold text-blue-400 hover:text-cyan-400">+ Add to Garage</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProducts.map((product) => (
                      <div key={product._id} className="bg-[#1a2035] rounded-2xl overflow-hidden border border-white/5 flex flex-col group">
                        <div className="relative h-48 bg-black/50 overflow-hidden">
                          <img src={getImg(product)} onError={(e) => { e.target.src = img1; }} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white">{product.title}</h3>
                            <span className="bg-blue-900/40 text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase border border-blue-500/20">Active</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-4">{new Date(product.createdAt).getFullYear()} • {product.category}</p>
                          <div className="flex gap-2 mt-auto">
                            <div className="bg-black/20 border border-white/5 rounded px-2 py-1 text-[10px] text-gray-400 font-mono">
                              ${product.price?.toLocaleString()}
                            </div>
                            <div className="bg-black/20 border border-white/5 rounded px-2 py-1 text-[10px] text-gray-400 font-mono capitalize">
                              {product.condition || 'Used'}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <Link to={`/edit-bike/${product._id}`} className="flex-1 text-center py-1.5 bg-white/5 hover:bg-blue-500/20 text-xs font-semibold text-gray-300 hover:text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-500/30">
                              Edit
                            </Link>
                            <button onClick={() => setProductToDelete(product._id)} className="flex-1 text-center py-1.5 bg-white/5 hover:bg-red-500/20 text-xs font-semibold text-gray-300 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist / Recent Activity */}
              <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Wishlist</h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-400 text-sm mb-3">Your wishlist is empty.</p>
                    <Link to="/marketplace" className="text-sm font-semibold text-blue-400 hover:text-cyan-400">Browse Marketplace</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.slice(0, 5).map((item) => (
                      <Link key={item._id} to={`/products/${item._id}`} className="relative h-40 rounded-xl overflow-hidden group">
                        <img src={getImg(item)} onError={(e) => { e.target.src = img1; }} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        </div>
                      </Link>
                    ))}
                    
                    {/* Add New Placeholder matching mockup */}
                    <Link to="/marketplace" className="relative h-40 rounded-xl overflow-hidden bg-[#1a2035] flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-[#252d47] transition-all group cursor-pointer">
                      <svg className="w-6 h-6 text-gray-500 group-hover:text-blue-400 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 group-hover:text-blue-400 transition-colors">Find New</span>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0f1629] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Delete Machine?</h3>
            <p className="text-gray-400 mb-8">Are you sure you want to remove this machine from your garage? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
