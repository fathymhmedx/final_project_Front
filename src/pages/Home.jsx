import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import heroImg from '../assets/hero.png';
import img1 from '../assets/img1.png';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredMachines, setFeaturedMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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

    fetchFeaturedMachines();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Links */}
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex-shrink-0">
                <img src={logo} alt="Velora" className="h-8 w-auto" />
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
                <Link to="/ride-events" className="hover:text-white transition-colors">Ride Events</Link>
                <Link to="#" className="hover:text-white transition-colors">Community</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-5 text-gray-400">
              <button className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <button className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <div className="relative group cursor-pointer pl-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-white/10">
                  {user?.profileImage ? (
                    <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name?.charAt(0) || 'U').toUpperCase()
                  )}
                </div>
                {/* Simple dropdown for logout */}
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                  <div className="bg-[#0f1629] border border-white/10 rounded-xl shadow-xl py-2">
                     <div className="px-4 py-2 border-b border-white/5 mb-1">
                       <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                       <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                     </div>
                     <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                       Profile Settings
                     </Link>
                     <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">
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
      <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img src={heroImg || img1} alt="Hero" className="w-full h-full object-cover opacity-60 mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/80 via-transparent to-[#0a0e1a]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Ride Beyond Limits
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light">
            Experience the next evolution of motorcycle performance and community. Join the elite network of Velora riders today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/marketplace">
              <Button variant="primary" className="px-8 py-3.5 text-base rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                Explore Marketplace
              </Button>
            </Link>
            <Button variant="secondary" className="px-8 py-3.5 text-base rounded-full bg-[#0f1629]/80 border border-white/10 hover:bg-[#1a2540]">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { value: '24k+', label: 'ACTIVE RIDERS' },
            { value: '150+', label: 'EVENTS MONTHLY' },
            { value: '12M', label: 'MILES LOGGED' },
            { value: '98%', label: 'SATISFACTION' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0f1629]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-center shadow-2xl">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1">
                {stat.value}
              </div>
              <div className="text-xs tracking-widest text-gray-400 font-semibold uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Machines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs tracking-widest text-blue-400 font-semibold uppercase mb-2">ELITE SELECTION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Machines</h2>
          </div>
          <div className="hidden sm:flex gap-3">
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
                  <img src={bike.images?.[0]?.url ? `http://localhost:8000/uploads/products/${bike.images[0].url}` : img1} alt={bike.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
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
        <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs tracking-widest text-blue-400 font-semibold uppercase mb-2">GLOBAL NETWORK</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Ride Events</h2>
            </div>
            <Link to="/ride-events" className="hidden sm:flex text-blue-400 hover:text-cyan-400 font-semibold items-center gap-2 transition-colors">
              Explore More Events <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Event Card */}
          <div className="lg:col-span-2 bg-[#0f1629] border border-white/5 rounded-2xl overflow-hidden flex flex-col sm:flex-row group hover:border-blue-500/30 transition-colors">
            <div className="sm:w-3/5 relative min-h-[250px] bg-black/50">
               <img src={img1} alt="Canyon Run" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                 OCT 12-14
               </div>
            </div>
            <div className="sm:w-2/5 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-3">Canyon Run</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                A three-day endurance ride through the Pacific Northwest's most challenging coastal routes. Limited to 50 Elite Members.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0f1629]"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#0f1629]"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0f1629] flex items-center justify-center text-xs font-bold">+47</div>
                </div>
                <Link to="/ride-events" className="px-6 py-3 rounded-lg bg-[#1a2035] hover:bg-[#252d47] text-white font-bold transition-all w-fit text-sm">
                  Explore Ride Events
                </Link>
              </div>
            </div>
          </div>

          {/* Small Event Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Neon Circuit Night</h3>
              <p className="text-gray-400 text-sm mb-4">Underground urban circuit ride through the heart of Tokyo. High-speed, high visibility.</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">NOV 24 • 21:00</span>
                <button className="text-blue-400 font-semibold hover:text-cyan-400">Details →</button>
              </div>
            </div>

            <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rider Tech Expo</h3>
              <p className="text-gray-400 text-sm mb-4">First look at the 2025 AI upgrades and augmented reality helmets.</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">DEC 05 • 09:00</span>
                <button className="text-blue-400 font-semibold hover:text-cyan-400">RSVP →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Collective Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs tracking-widest text-gray-400 font-semibold uppercase mb-2">RIDER STORIES</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">The Collective</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { title: 'Peak Performance', author: 'by Alex "Vortex" Chen', img: img1 },
            { title: 'Digital Nomad', author: 'by Sarah Miller', img: img1 },
            { title: 'Track Master', author: 'by Marco Rossi', img: img1 },
          ].map((story, i) => (
            <div key={i} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
              <img src={story.img} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{story.title}</h3>
                <p className="text-sm text-gray-400">{story.author}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" className="px-8 border border-white/10 bg-[#0f1629]">
          View All Stories
        </Button>
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
