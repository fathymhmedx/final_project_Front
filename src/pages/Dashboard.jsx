import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isAdmin = user?.role === 'admin';

  const stats = [
    {
      label: 'Total Rides',
      value: '1,284',
      change: '+12%',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
    },
    {
      label: 'Active Listings',
      value: '47',
      change: '+5%',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
      ),
    },
    {
      label: 'Saved Bikes',
      value: '23',
      change: '+3',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      value: '8',
      change: '2 new',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
    },
  ];

  const recentActivity = [
    { action: 'Listed a new motorcycle', detail: '2024 Ducati Panigale V4', time: '2 hours ago' },
    { action: 'Received a message', detail: 'From Alex about Kawasaki ZX-10R', time: '5 hours ago' },
    { action: 'Saved a listing', detail: '2023 BMW S1000RR', time: '1 day ago' },
    { action: 'Updated profile', detail: 'Changed profile picture', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Logo + Navigation */}
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logo} alt="Velora" className="w-8 h-8" />
              </Link>
              
              <Link to="/home" className="hidden sm:block hover:text-white transition-colors text-sm font-medium text-gray-400">
                Home
              </Link>
            </div>

            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold overflow-hidden border border-white/10">
                  {user?.profileImage ? (
                    <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-white leading-tight">
                    {user?.name || 'User'}
                  </span>
                  {isAdmin && (
                    <span className="text-xs font-medium leading-tight text-orange-400">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || 'Rider'}!
              </h1>
              <p className="text-gray-400">
                Here&apos;s what&apos;s happening with your marketplace today.
              </p>
            </div>
            <span
              className={`inline-flex items-center self-start px-4 py-1.5 rounded-full text-sm font-semibold ${
                isAdmin
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              {isAdmin ? '⚡ Admin' : '🏍️ Rider'}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:from-blue-500/30 group-hover:to-cyan-400/30 transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all duration-200"
              >
                {/* Timeline dot */}
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shrink-0 ring-4 ring-blue-500/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.action}</p>
                  <p className="text-sm text-gray-400 truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
