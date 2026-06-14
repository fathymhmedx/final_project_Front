import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import img1 from '../assets/img1.png';

const API_IMG = 'http://localhost:8000';

export default function RideEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchEvent = async () => {
    try {
      const { data } = await axiosInstance.get(`/ride-events/${id}`);
      setEvent(data?.data || data);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const toggleJoin = async () => {
    if (!user) return navigate('/login');
    const isParticipant = event.participants?.some(p => p === user._id || p._id === user._id);
    
    try {
      if (isParticipant) {
        await axiosInstance.delete(`/ride-events/${event._id}/leave`);
      } else {
        await axiosInstance.post(`/ride-events/${event._id}/join`);
      }
      fetchEvent();
    } catch (err) {
      console.error('Error toggling participation:', err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/ride-events/${event._id}`);
      navigate('/ride-events');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(err.response?.data?.message || 'Failed to delete event');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen bg-[#0a0e1a] text-white">
        <Sidebar variant="events" />
        <main className="flex-1 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <button onClick={() => navigate('/ride-events')} className="text-blue-400 hover:text-cyan-400 font-semibold">
            ← Go Back
          </button>
        </main>
      </div>
    );
  }

  const getImgUrl = (url) => url ? `${API_IMG}/uploads/ride-events/${url}` : img1;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const isCreator = user && event.createdBy?._id === user._id;
  const isParticipant = user && event.participants?.some(p => p === user._id || p._id === user._id);
  const isFull = event.participantsCount >= event.maxParticipants;

  const difficultyColors = {
    easy: 'text-green-400 border-green-500/20 bg-green-500/10',
    medium: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
    hard: 'text-red-400 border-red-500/20 bg-red-500/10'
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-10">
          
          <button onClick={() => navigate('/ride-events')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Events
          </button>

          {/* Header */}
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded uppercase border border-white/10 tracking-wider">
              {event.type}
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded uppercase border tracking-wider ${difficultyColors[event.difficulty] || difficultyColors.easy}`}>
              {event.difficulty}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">{event.title}</h1>

          {/* Cover Image */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-[#0f1629] border border-white/5 mb-10 shadow-2xl">
            <img 
              src={getImgUrl(event.coverImage)} 
              alt={event.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-80"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="bg-[#0f1629] border border-white/5 rounded-3xl p-6 md:p-8">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">About This Event</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {event.description || 'No description provided for this event.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-white">{formatDate(event.startDate)}</p>
                </div>
                
                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Meeting Point</p>
                  <p className="text-sm font-semibold text-white">{event.meetingPoint}</p>
                </div>

                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Distance</p>
                  <p className="text-sm font-semibold text-white">{event.distance ? `${event.distance} km` : 'N/A'}</p>
                </div>

                <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <span className="text-sm font-bold text-gray-300">{event.participantsCount} / {event.maxParticipants}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Capacity</p>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (event.participantsCount / event.maxParticipants) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Actions & Creator */}
            <div className="flex flex-col gap-6">
              
              <div className="bg-[#0f1629] border border-white/5 p-6 rounded-3xl shadow-xl">
                {isCreator ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => navigate(`/ride-events/${event._id}/edit`)}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                    >
                      Edit Event
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-all"
                    >
                      Delete Event
                    </button>
                  </div>
                ) : isParticipant ? (
                  <button 
                    onClick={toggleJoin}
                    className="w-full py-4 bg-transparent border border-white/20 text-gray-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 font-bold rounded-xl transition-all"
                  >
                    Leave Event
                  </button>
                ) : isFull ? (
                  <button 
                    disabled
                    className="w-full py-4 bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                  >
                    Event Full
                  </button>
                ) : (
                  <button 
                    onClick={toggleJoin}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Join Event
                  </button>
                )}
              </div>

              <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Organizer</h3>
                <div className="flex items-center gap-4">
                  <Link to={`/users/${event.createdBy?._id}`} className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-[#0f1629] flex-shrink-0">
                    {event.createdBy?.profileImage ? (
                      <img src={`${API_IMG}/uploads/users/${event.createdBy.profileImage}`} alt={event.createdBy.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-gradient-to-tr from-blue-500 to-cyan-400">
                        {event.createdBy?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link to={`/users/${event.createdBy?._id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors block">
                      {event.createdBy?.name}
                    </Link>
                    <p className="text-xs text-gray-400">{event.createdBy?.rank || 'Rider'}</p>
                  </div>
                </div>
              </div>

              {event.participants && event.participants.length > 0 && (
                <div className="bg-[#0b1120] border border-white/5 p-6 rounded-3xl">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Participants ({event.participantsCount})</h3>
                  <div className="flex flex-wrap gap-3">
                    {event.participants.map(p => (
                      <Link key={p._id} to={`/users/${p._id}`} title={p.name} className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border-2 border-transparent hover:border-blue-400 transition-all flex-shrink-0">
                        {p.profileImage ? (
                          <img src={`${API_IMG}/uploads/users/${p.profileImage}`} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-gray-700 text-white">
                            {p.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0f1629] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Delete Event?</h3>
            <p className="text-gray-400 mb-8">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
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
