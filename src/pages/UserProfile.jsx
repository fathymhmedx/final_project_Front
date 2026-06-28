import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { getUserPosts } from '../api/communityService';
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
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
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
        const [userRes, productsRes, followersRes, followingRes, eventsRes, postsRes] = await Promise.all([
          axiosInstance.get(`/users/${id}`),
          axiosInstance.get(`/products?seller=${id}`),
          axiosInstance.get(`/users/${id}/followers`),
          axiosInstance.get(`/users/${id}/following`),
          axiosInstance.get('/ride-events/upcoming'),
          getUserPosts(id).catch(err => { console.error(err); return { data: { posts: [] } }; })
        ]);

        setProfileUser(userRes.data?.data?.user);
        setProducts(productsRes.data?.data?.products || []);
        
        const followersList = followersRes.data?.data?.followers || [];
        setFollowers(followersList);
        setFollowing(followingRes.data?.data?.following || []);
        setUpcomingEvents(eventsRes.data?.data?.events || []);
        setUserPosts(postsRes.data?.posts || []);

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
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
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
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        {/* ══════════ Top Hero / Cover Section ══════════ */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 md:pt-6">
          <div className="relative w-full h-[180px] md:h-[250px] rounded-2xl md:rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
            <img src={profileUser.coverImage ? (profileUser.coverImage.startsWith('http') ? profileUser.coverImage : `${API_IMG}/uploads/users/${profileUser.coverImage}`) : heroImg} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        {/* User Profile Info */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center text-center md:text-left md:items-end gap-4 md:gap-6 relative z-10 pb-6 md:pb-8 border-b border-white/5 pt-2">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#0a0e1a] bg-[#0f1629] overflow-hidden flex-shrink-0 relative">
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

              {/* Community Posts */}
              <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Community Posts</h2>
                </div>

                {userPosts.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-400 text-sm">No community posts yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {userPosts.map((post) => (
                      <Link key={post._id} to={`/community/post/${post._id}`} className="block p-4 bg-[#1a2035] border border-white/5 hover:border-blue-500/30 rounded-xl transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-navy-800">
                            {post.author?.profileImage ? (
                              <img src={`http://localhost:8000/uploads/users/${post.author.profileImage}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white bg-blue-600">
                                {post.author?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{post.author?.name}</p>
                            <p className="text-[10px] text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-3 mb-3">{post.content}</p>
                        
                        {post.images && post.images.length > 0 && (
                          <div className="flex gap-2 mb-3 overflow-hidden">
                            {post.images.slice(0, 3).map((img, idx) => (
                              <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={`http://localhost:8000/uploads/posts/${img.url}`} alt="Post img" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                            {post.images.length > 3 && (
                              <div className="w-20 h-20 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                +{post.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-red-400/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> {post.likesCount || 0}</span>
                          <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-blue-400/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg> {post.commentsCount || 0}</span>
                        </div>
                      </Link>
                    ))}
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
