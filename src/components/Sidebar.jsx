import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const navItems = [
  {
    label: 'Marketplace',
    path: '/marketplace',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
      </svg>
    ),
  },
  {
    label: 'Ride Events',
    path: '/ride-events',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Social Feed',
    path: '#',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    label: 'Garage',
    path: '/garage',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

/**
 * Sidebar component — used across Marketplace, Ride Events, etc.
 *
 * Props:
 *  - variant: 'marketplace' (default) | 'events'
 *      marketplace → shows Advanced Filters panel
 *      events      → shows user profile card at top, no filters
 *  - filters / onFilterChange / onSearch — only used for marketplace
 *  - searchPlaceholder — custom placeholder text for the search input
 */
export default function Sidebar({
  variant = 'marketplace',
  filters,
  onFilterChange,
  onSearch,
  searchPlaceholder,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleCategoryToggle = (cat) => {
    const current = filters?.categories || [];
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onFilterChange?.({ ...filters, categories: updated });
  };

  const handleConditionChange = (cond) => {
    const current = filters?.condition;
    onFilterChange?.({ ...filters, condition: current === cond ? '' : cond });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange?.({ ...filters, [field]: value });
  };

  const showFilters = variant === 'marketplace';

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl bg-[#0b1120]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg shadow-black/30"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`w-[260px] flex-shrink-0 bg-[#0b1120] border-r border-white/5 h-screen flex flex-col overflow-y-auto scrollbar-hide
        fixed top-0 left-0 z-[50] transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto
      `}>
      {/* Logo + Search */}
      <div className="p-5 pb-3">
        <Link to="/home" className="flex items-center gap-2.5 mb-6">
          <img src={logo} alt="Velora" className="h-7 w-auto" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder || 'Search models, brands...'}
            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/30 transition-all"
          />
        </form>
      </div>

      {/* User Profile Card (shown at top for events variant) */}
      {!showFilters && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white/10 flex-shrink-0">
              {user?.profileImage ? (
                <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name?.charAt(0) || 'U').toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-400 truncate">{user?.name || 'Rider One'}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.rank || (user?.role === 'admin' ? 'Administrator' : 'New Rider')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-3 mb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5 ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5 border-t border-white/5 my-3"></div>

      {/* ═══ Advanced Filters (marketplace only) ═══ */}
      {showFilters && (
        <div className="px-5 flex-1">
          <p className="text-[10px] tracking-[0.2em] text-gray-500 font-semibold uppercase mb-4">Advanced Filters</p>

          {/* Price Range */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-400 mb-2.5 block">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters?.priceMin || ''}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                className="w-1/2 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters?.priceMax || ''}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                className="w-1/2 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-400 mb-2.5 block">Category</label>
            <div className="space-y-2">
              {[
                { value: 'motorcycle', label: 'Motorcycles' },
                { value: 'parts', label: 'Trading gear' },
                { value: 'accessories', label: 'Accessories' },
              ].map((cat) => {
                const isChecked = (filters?.categories || []).includes(cat.value);
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                        isChecked
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-white/15 bg-white/5 group-hover:border-white/25'
                      }`}
                      onClick={() => handleCategoryToggle(cat.value)}
                    >
                      {isChecked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs transition-colors ${isChecked ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
                      onClick={() => handleCategoryToggle(cat.value)}
                    >
                      {cat.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Condition */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-400 mb-2.5 block">Condition</label>
            <div className="flex gap-2">
              {['new', 'used'].map((cond) => {
                const isActive = filters?.condition === cond;
                return (
                  <button
                    key={cond}
                    onClick={() => handleConditionChange(cond)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/8 hover:bg-white/8 hover:text-gray-300'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for non-filter variant */}
      {!showFilters && <div className="flex-1"></div>}

      {/* User Profile Section at bottom */}
      <div className="mt-auto border-t border-white/5 p-4">
        {/* Show user info at bottom for marketplace variant */}
        {showFilters && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white/10 flex-shrink-0">
              {user?.profileImage ? (
                <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name?.charAt(0) || 'U').toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Rider'}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.rank || (user?.role === 'admin' ? 'Administrator' : 'New Rider')}</p>
            </div>
          </div>
        )}

        <Link
          to="/sell-bike"
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Sell Bike
        </Link>

        {/* Bottom links */}
        <div className="space-y-1">
          <Link to="/profile" className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-gray-300 py-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </Link>
          <Link to="#" className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-gray-300 py-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
            Support
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-red-400 py-1.5 transition-colors w-full text-left">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
