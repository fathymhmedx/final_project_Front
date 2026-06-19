import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import img1 from '../assets/img1.png';
import heroImg from '../assets/hero.png';

const API_IMG = 'http://localhost:8000';

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    // If user is viewing their own profile, redirect to /garage
    if (currentUser && currentUser._id === id) {
      navigate('/garage', { replace: true });
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [userRes, productsRes, followersRes, followingRes] = await Promise.all([
          axiosInstance.get(`/users/${id}`),
          axiosInstance.get(`/products?seller=${id}`),
          axiosInstance.get(`/users/${id}/followers`),
          axiosInstance.get(`/users/${id}/following`),
        ]);

        setProfileUser(userRes.data?.data?.user);
        setProducts(productsRes.data?.data?.products || []);
        
        const followersList = followersRes.data?.data?.followers || [];
        setFollowers(followersList);
        setFollowing(followingRes.data?.data?.following || []);

        // Check if current user is already following this user
        if (currentUser) {
          const isAlreadyFollowing = followersList.some(f => f._id === currentUser._id);
          setIsFollowing(isAlreadyFollowing);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser, navigate]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axiosInstance.patch(`/users/${id}/unfollow`);
        setIsFollowing(false);
        setFollowers(prev => prev.filter(f => f._id !== currentUser._id));
      } else {
        await axiosInstance.patch(`/users/${id}/follow`);
        setIsFollowing(true);
        setFollowers(prev => [...prev, currentUser]);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setFollowLoading(false);
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#05080f] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen bg-[#05080f] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-cyan-400 font-semibold">← Go Back</button>
        </main>
      </div>
    );
  }

  const memberSince = new Date(profileUser.createdAt).getFullYear();

  return (
    <div className="flex min-h-screen bg-[#05080f] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        {/* ══════════ Top Hero / Cover Section ══════════ */}
        <div className="relative w-full h-[180px] md:h-[300px]">
          <img src={heroImg} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] to-transparent opacity-80 md:opacity-100 md:from-[#05080f]/80"></div>
        </div>

        {/* User Profile Info */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center text-center md:text-left md:items-end gap-4 md:gap-6 -mt-12 md:-mt-20 relative z-10 pb-6 md:pb-8 border-b border-white/5">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#05080f] bg-[#0f1629] overflow-hidden flex-shrink-0 relative">
            {profileUser.profileImage ? (
              <img 
                src={getUserImg(profileUser)} 
                alt={profileUser.name} 
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                className="w-full h-full object-cover" 
              />
            ) : null}
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 bg-gray-800" style={{ display: profileUser.profileImage ? 'none' : 'flex' }}>
              {(profileUser.name?.charAt(0) || 'U').toUpperCase()}
            </div>
            {profileUser.isVerified && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-900 text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap shadow-md">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </div>
            )}
          </div>

          <div className="flex-1 md:mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{profileUser.name}</h1>
            <p className="text-[11px] md:text-xs text-gray-400 font-semibold mb-2 md:mb-3">
              {profileUser.rank || 'New Rider'} • Since {memberSince}
            </p>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed mx-auto md:mx-0">
              {profileUser.bio || 'This rider has not added a bio yet.'}
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 md:mb-2">
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 ${
                isFollowing
                  ? 'bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30'
                  : 'bg-blue-200 hover:bg-white text-blue-900'
              }`}
            >
              {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#1a2035] hover:bg-[#252d47] text-white text-sm font-bold rounded-lg transition-colors">
              Message
            </button>
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
                    <p className="text-sm font-bold text-white truncate">{profileUser.location || '—'}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Bike Type</p>
                    <p className="text-sm font-bold text-white truncate">{profileUser.bikeType || '—'}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Followers</p>
                    <p className="text-xl font-bold text-cyan-400">{followers.length}</p>
                  </div>
                  <div className="bg-[#1a2035] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Following</p>
                    <p className="text-xl font-bold text-blue-300">{following.length}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Rides (Static placeholder) */}
              <div className="bg-[#121622] rounded-2xl p-5 border border-white/5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Upcoming Rides</h3>
                  <button className="text-[11px] font-bold text-blue-400 hover:text-cyan-400">View All</button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      <img src={img1} alt="Ride" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">Midnight Alpine Loop</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Oct 12 • 42 Riders</p>
                      <p className="text-[10px] text-gray-500">Joined</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      <img src={img1} alt="Ride" className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">Coastal Canyon Run</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Oct 28 • 12 Riders</p>
                      <p className="text-[10px] text-gray-500">Joined</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════ Right Column (The Garage & Recent Activity) ══════════ */}
            <div className="lg:col-span-9 space-y-6">

              {/* The Garage */}
              <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">The Garage</h2>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-400 text-sm">This rider hasn't listed any machines yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <Link key={product._id} to={`/products/${product._id}`} className="bg-[#1a2035] rounded-2xl overflow-hidden border border-white/5 flex flex-col group hover:border-blue-500/30 transition-all">
                        <div className="relative h-48 bg-black/50 overflow-hidden">
                          <img src={getImg(product)} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                          {product.status === 'available' && (
                            <span className="absolute top-3 right-3 bg-blue-900/40 text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase border border-blue-500/20">Active</span>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-1">{product.title}</h3>
                          <p className="text-xs text-gray-400 mb-4">{new Date(product.createdAt).getFullYear()} • {product.category}</p>
                          <div className="flex gap-2 mt-auto">
                            <div className="bg-black/20 border border-white/5 rounded px-2 py-1 text-[10px] text-gray-400 font-mono">
                              ${product.price?.toLocaleString()}
                            </div>
                            <div className="bg-black/20 border border-white/5 rounded px-2 py-1 text-[10px] text-gray-400 font-mono capitalize">
                              {product.condition || 'Used'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-400 text-sm">No recent activity to show.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.slice(0, 5).map((item) => (
                      <Link key={item._id} to={`/products/${item._id}`} className="relative h-40 rounded-xl overflow-hidden group">
                        <img src={getImg(item)} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        </div>
                      </Link>
                    ))}

                    {/* Post New placeholder */}
                    <div className="relative h-40 rounded-xl overflow-hidden bg-[#1a2035] flex flex-col items-center justify-center border border-dashed border-white/10">
                      <svg className="w-6 h-6 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                      <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500">POST NEW</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
