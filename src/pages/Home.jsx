import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import img1 from '../assets/img1.png';
import authBg from '../assets/auth_bg.png';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredMachines, setFeaturedMachines] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [topRiders, setTopRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(true);
  const scrollRef = useRef(null);
  const ridersScrollRef = useRef(null);

  const scrollRiders = (direction) => {
    if (ridersScrollRef.current) {
      const { current } = ridersScrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFeaturedMachines = async () => {
      try {
        const { data } = await axiosInstance.get('/products?limit=6&page=1');
        setFeaturedMachines(data?.data?.products || []);
      } catch (error) {
        console.error('Error fetching featured machines:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const { data } = await axiosInstance.get('/ride-events/upcoming');
        setUpcomingEvents(data?.data?.events || []);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchTopRiders = async () => {
      try {
        const { data } = await axiosInstance.get('/users/top-riders?limit=10');
        setTopRiders(data?.data?.users || []);
      } catch (error) {
        console.error('Error fetching top riders:', error);
      } finally {
        setLoadingRiders(false);
      }
    };

    fetchFeaturedMachines();
    fetchUpcomingEvents();
    fetchTopRiders();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const getProductImgUrl = (url) => {
    if (!url) return img1;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/uploads/products/${url}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Links */}
            <div className="flex items-center gap-10">
              <Link to="/home" className="flex-shrink-0 hover:opacity-80 hover:scale-105 transition-all duration-300">
                <img src={logo} alt="Velora" className="h-8 w-auto drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
              </Link>
              <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300 tracking-wide">
                <Link to="/marketplace" className="relative group hover:text-white transition-colors py-2">
                  Marketplace
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
                <Link to="/ride-events" className="relative group hover:text-white transition-colors py-2">
                  Ride Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
                <Link to="/community" className="relative group hover:text-white transition-colors py-2">
                  Community
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/dashboard" className="relative group hover:text-white transition-colors py-2">
                    Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 text-gray-400">
              <button className="relative p-2.5 rounded-full hover:bg-white/5 hover:text-white transition-all duration-300 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {/* Notification Dot */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] border-2 border-[#0a0e1a]"></span>
              </button>
              
              <div className="relative group cursor-pointer pl-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-transparent group-hover:border-cyan-400 shadow-lg transition-all duration-300">
                  {user?.profileImage ? (
                    <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    (user?.name?.charAt(0) || 'U').toUpperCase()
                  )}
                </div>
                {/* Enhanced Dropdown */}
                <div className="absolute right-0 top-[120%] pt-2 w-56 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-[#0a0e1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                     <div className="px-5 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                       <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                       <p className="text-xs text-cyan-400 truncate mt-0.5">{user?.email}</p>
                     </div>
                     <Link to="/profile" className="block w-full text-left px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                       <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       Profile Settings
                     </Link>
                     <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                       Sign out
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-transparent to-[#0a0e1a]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left flex flex-col justify-center animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-8 mx-auto lg:mx-0 w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                The Premier Marketplace
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                Ride Beyond <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Limits</span>
              </h1>
              
              <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Experience the next evolution of motorcycle performance and community. Join the elite network of Velora riders today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/marketplace" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full px-8 py-3.5 text-base rounded-full shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 group transition-all duration-300 hover:scale-105">
                    Explore Marketplace
                    <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Button>
                </Link>
                <Link to="/community" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full px-8 py-3.5 text-base rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-105">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block animate-slide-in-right h-[600px] w-full">
              {/* Subtle glowing backplate */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Frameless Image */}
              <div className="absolute right-[-10vw] top-1/2 -translate-y-1/2 w-[140%] h-[120%] transform transition-transform duration-700 hover:scale-[1.02] group pointer-events-none">
                <img 
                  src={authBg} 
                  alt="Velora Rider" 
                  className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
                  style={{ WebkitMaskImage: 'radial-gradient(ellipse at right center, black 40%, transparent 80%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Machines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative flex flex-col items-center mb-10">
          <div className="text-center">
            <p className="text-xs tracking-widest text-blue-400 font-semibold uppercase mb-2">ELITE SELECTION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Machines</h2>
          </div>
          <div className="hidden md:flex gap-3 absolute right-0 bottom-1">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            <div className="w-full text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading Elite Selection...</p>
            </div>
          ) : featuredMachines.length > 0 ? (
            featuredMachines.map((bike) => (
              <div key={bike._id} className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-21.33px)] snap-start bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden bg-black/40">
                  <img src={getProductImgUrl(bike.images?.[0]?.url)} alt={bike.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  {bike.condition && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      {bike.condition}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{bike.title}</h3>
                    <span className="text-cyan-400 font-semibold whitespace-nowrap ml-2">${bike.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4 mb-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="truncate">{bike.location || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 capitalize flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      {bike.category}
                    </div>
                  </div>
                  <Link to={`/products/${bike._id}`}>
                    <Button variant="secondary" fullWidth className="border border-white/10 hover:border-blue-500/50 bg-transparent text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-gray-400">
              No featured machines available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Ride Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative flex flex-col items-center mb-10">
          <div className="text-center">
            <p className="text-xs tracking-widest text-blue-400 font-semibold uppercase mb-2">GLOBAL NETWORK</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Ride Events</h2>
          </div>
          <Link to="/ride-events" className="hidden md:flex text-blue-400 hover:text-cyan-400 font-semibold items-center gap-2 transition-colors absolute right-0 bottom-2">
            Explore More Events <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        {loadingEvents ? (
          <div className="w-full text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Events...</p>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <>
            {/* Mobile/Tablet Horizontal Scroll Layout */}
            <div className="flex lg:hidden overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {upcomingEvents.map(event => (
                <div key={event._id} className="w-[85vw] sm:w-[350px] flex-shrink-0 snap-center bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden flex flex-col group shadow-lg">
                  <div className="h-48 w-full relative bg-[#1a2540] overflow-hidden">
                    <img src={event.coverImage ? `http://localhost:8000/uploads/ride-events/${event.coverImage}` : img1} alt={event.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {event.description || 'No description available for this event.'}
                    </p>
                    <p className="text-xs text-blue-400 font-semibold uppercase mb-4">
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                    <div className="flex justify-between items-center text-sm mt-auto border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs truncate max-w-[65%]">
                         <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         <span className="truncate">{event.meetingPoint}</span>
                      </div>
                      <Link to={`/ride-events/${event._id}`} className="text-cyan-400 font-bold hover:text-white transition-colors text-sm whitespace-nowrap">Details →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[400px]">
            {/* Large Event Card */}
            {upcomingEvents[0] && (
              <div className="lg:col-span-2 bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden flex flex-col sm:flex-row group hover:border-blue-500/30 transition-colors h-full">
                <div className="sm:w-3/5 relative min-h-[250px] bg-black/50">
                  <img src={upcomingEvents[0].coverImage ? `http://localhost:8000/uploads/ride-events/${upcomingEvents[0].coverImage}` : img1} alt={upcomingEvents[0].title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {new Date(upcomingEvents[0].startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                  </div>
                </div>
                <div className="w-full sm:w-2/5 p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-3">{upcomingEvents[0].title}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {upcomingEvents[0].description || 'No description available for this event.'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <span className="font-bold">{upcomingEvents[0].participantsCount}</span> / {upcomingEvents[0].maxParticipants} Riders
                    </div>
                    <Link to={`/ride-events/${upcomingEvents[0]._id}`} className="px-6 py-3 rounded-lg bg-[#1a2035] border border-white/5 hover:border-blue-500/30 hover:bg-[#252d47] text-white font-bold transition-all w-fit text-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Small Event Cards */}
            <div className="flex flex-col gap-6 lg:gap-4 lg:overflow-y-auto lg:pr-2 lg:h-full mt-6 lg:mt-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {upcomingEvents.slice(1).map((event) => (
                <div key={event._id} className="bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all flex-shrink-0 flex flex-col group shadow-lg">
                  <div className="h-48 lg:h-28 w-full relative bg-[#1a2540] overflow-hidden">
                    <img src={event.coverImage ? `http://localhost:8000/uploads/ride-events/${event.coverImage}` : img1} alt={event.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col -mt-2 relative z-10">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase mb-4">
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                    <div className="flex justify-between items-center text-sm mt-auto border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs truncate max-w-[65%]">
                         <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         <span className="truncate">{event.meetingPoint}</span>
                      </div>
                      <Link to={`/ride-events/${event._id}`} className="text-blue-400 font-semibold hover:text-cyan-400 text-xs whitespace-nowrap">Details →</Link>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingEvents.length <= 1 && (
                <div className="bg-[#0f1629] border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 text-center min-h-[150px]">
                  <p className="text-sm text-gray-400">No more upcoming events.</p>
                </div>
              )}
            </div>
          </div>
          </>
        ) : (
          <div className="w-full text-center py-12 bg-[#0f1629] rounded-2xl border border-white/5">
            <p className="text-gray-400">No upcoming events right now. Check back later!</p>
          </div>
        )}
      </section>

      {/* Elite Riders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-cyan-400 font-bold uppercase mb-2">COMMUNITY</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Elite Riders</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Discover and follow the most influential bikers in the Velora community based on their rank and followers.</p>
        </div>

        {loadingRiders ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : topRiders.length > 0 ? (
          <>
            <div className="flex lg:grid flex-nowrap lg:grid-cols-3 gap-6 lg:gap-8 pt-8 pb-8 lg:pb-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {topRiders.slice(0, 3).map((rider, index) => (
                <div key={rider._id} className="relative w-[85vw] sm:w-[350px] lg:w-auto flex-shrink-0 snap-center lg:snap-align-none bg-[#0f1629]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 pt-16 flex flex-col items-center hover:border-cyan-500/30 hover:-translate-y-2 transition-all duration-300 shadow-2xl group mt-10">
                  
                  {/* Number Badge (1, 2, 3) */}
                  <div className="absolute top-4 left-6 text-5xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors pointer-events-none">
                    0{index + 1}
                  </div>

                  {/* Floating Avatar */}
                  <div className="absolute -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#060b18] shadow-xl group-hover:border-cyan-400 transition-colors bg-gray-800">
                    {rider.profileImage ? (
                      <img src={`http://localhost:8000/uploads/users/${rider.profileImage}`} alt={rider.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                        {rider.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Verified Badge */}
                  {rider.isVerified && (
                    <div className="absolute -top-2 right-[50%] translate-x-10 bg-blue-500 rounded-full p-1 border-2 border-[#060b18] z-10 shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors truncate w-full text-center relative z-10">{rider.name}</h3>
                  
                  <span className={`relative z-10 text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full mb-6 ${rider.rank === 'Administrator' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : rider.rank === 'Elite Member' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {rider.rank}
                  </span>

                  <p className="text-sm text-gray-400 text-center line-clamp-2 mb-8 min-h-[40px] relative z-10">
                    {rider.bio || "Passionate motorcycle enthusiast exploring the open roads."}
                  </p>

                  <div className="grid grid-cols-2 w-full gap-4 mb-2 relative z-10">
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                      <span className="text-white font-bold text-lg">{rider.followersCount}</span>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                      <span className="text-white font-bold text-lg line-clamp-1 text-center w-full px-1">{rider.bikeType || 'Any'}</span>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Bike</span>
                    </div>
                  </div>
                  
                  <Link to={`/users/${rider._id}`} className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[80%] py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center shadow-[0_0_15px_rgba(0,229,255,0.3)] z-20">
                    View Full Profile
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to="/community" className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/10 bg-[#0f1629] text-white text-sm font-semibold hover:bg-white/5 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/10">
                Explore Full Community
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No riders found.</div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05080f] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <img src={logo} alt="Velora" className="h-8 w-auto mb-6 opacity-80" />
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                The world's premier platform for the modern rider. Connecting high-performance engineering with a global community of enthusiasts. Ride beyond limits with precision and technology.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">in</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">tw</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">ig</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><Link to="/marketplace" className="hover:text-blue-400 transition-colors">Marketplace</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Safety Guides</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community Rules</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-600">
            <p>© 2026 Velora Technologies. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
              <a href="#" className="hover:text-gray-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
