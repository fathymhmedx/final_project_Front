import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import rideHeroImg from '../assets/ride_events_hero.png';
import img1 from '../assets/img1.png';

const API_IMG = 'http://localhost:8000';

export default function RideEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/ride-events?page=${page}&limit=3`;
      
      if (typeFilter === 'my-events') {
        url = '/ride-events/my-events';
      } else if (typeFilter === 'created-by-me') {
        url += `&createdBy=${user._id}`;
      } else {
        if (keyword) url += `&keyword=${keyword}`;
        if (typeFilter) url += `&type=${typeFilter}`;
      }

      const { data } = await axiosInstance.get(url);
      setEvents(data?.data?.events || data?.data || []);
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error('Error fetching ride events:', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, typeFilter]);

  const fetchUpcoming = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/ride-events/upcoming');
      setUpcomingEvents(data?.data?.events || []);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const toggleJoin = async (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    const isParticipant = event.participants.some(p => p === user._id || p._id === user._id);

    try {
      if (isParticipant) {
        await axiosInstance.delete(`/ride-events/${event._id}/leave`);
      } else {
        await axiosInstance.post(`/ride-events/${event._id}/join`);
      }
      
      const updateList = (list) => list.map(ev => {
        if (ev._id === event._id) {
          return {
            ...ev,
            participants: isParticipant 
              ? ev.participants.filter(p => p !== user._id && p._id !== user._id)
              : [...ev.participants, user._id],
            participantsCount: isParticipant ? ev.participantsCount - 1 : ev.participantsCount + 1
          };
        }
        return ev;
      });

      setEvents(prev => updateList(prev));
      setUpcomingEvents(prev => updateList(prev));
    } catch (err) {
      console.error('Error toggling participation:', err);
      setActionError(err.response?.data?.message || 'Action failed');
      setTimeout(() => setActionError(''), 5000);
    }
  };

  const getImg = (item) => item?.coverImage ? `${API_IMG}/uploads/ride-events/${item.coverImage}` : img1;

  const isUserParticipant = (event) => {
    if (!user) return false;
    return event.participants.some(p => p === user._id || p._id === user._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-20 pb-10 lg:py-10">
          {/* Action Error Toast */}
          {actionError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-red-400">{actionError}</p>
            </div>
          )}

          {/* ══════════ Hero Section ══════════ */}
          <div className="relative w-full h-[320px] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
            <img 
              src={rideHeroImg} 
              alt="Ride Events Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 via-[#0a0e1a]/50 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 mb-3 uppercase">Upcoming Gatherings</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
                Ride Events
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed mb-8 drop-shadow">
                Connect with the community, explore new routes, and join the elite Velora riders on the open road.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                <Link to="/ride-events/create" className="flex justify-center items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-100 hover:bg-white text-blue-900 text-sm sm:text-base font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 w-full sm:w-auto whitespace-nowrap">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Create Event
                </Link>
                {user && (
                  <button 
                    onClick={() => { 
                      setTypeFilter('created-by-me'); 
                      setPage(1); 
                      document.getElementById('events-filter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="flex justify-center items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[#0f1629]/50 hover:bg-white/10 text-white text-sm sm:text-base font-bold rounded-xl border border-white/20 transition-all backdrop-blur-md shadow-lg w-full sm:w-auto whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Ride Events
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ══════════ Filter Bar ══════════ */}
          <div id="events-filter" className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {['', ...(user ? ['my-events'] : []), 'group', 'meetup', 'social', 'workshop'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                    typeFilter === t 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {t === '' ? 'All Events' : t === 'my-events' ? 'Joined Events' : t}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search events..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f1629] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>
          </div>

          {/* ══════════ Main Content Grid ══════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* ── Featured Event (Large) ── */}
            {upcomingEvents[0] && (
              <Link to={`/ride-events/${upcomingEvents[0]._id}`} className="lg:col-span-2 bg-[#0f1629] border border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-0"></div>
                <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity">
                  <img src={getImg(upcomingEvents[0])} alt={upcomingEvents[0].title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f1629] via-[#0f1629]/70 to-transparent"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Featured Event</span>
                    {isUserParticipant(upcomingEvents[0]) && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Joined</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{upcomingEvents[0].title}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {formatDate(upcomingEvents[0].startDate)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {upcomingEvents[0].meetingPoint}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                       <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                       {upcomingEvents[0].participantsCount} / {upcomingEvents[0].maxParticipants} Riders
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => toggleJoin(e, upcomingEvents[0])}
                  className={`w-full py-3 font-semibold rounded-xl border transition-all z-10 ${
                    isUserParticipant(upcomingEvents[0]) 
                      ? 'bg-transparent border-white/20 text-gray-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10'
                      : 'bg-white/5 border-white/10 text-white hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10'
                  }`}
                >
                  {isUserParticipant(upcomingEvents[0]) ? 'Leave Event' : 'Join Event'}
                </button>
              </Link>
            )}

            {/* ── Upcoming Events List ── */}
            <div className="flex flex-col gap-4">
              {upcomingEvents.slice(1, 3).map((event) => (
                <Link key={event._id} to={`/ride-events/${event._id}`} className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all flex-1 flex flex-col">
                  <div className="h-24 bg-[#1a2540] overflow-hidden relative">
                    <img src={getImg(event)} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase text-white tracking-wider border border-white/10">{event.type}</div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{formatDate(event.startDate)}</p>
                    <button 
                      onClick={(e) => toggleJoin(e, event)}
                      className={`mt-auto w-full py-2 text-xs font-bold rounded-lg transition-colors border ${
                        isUserParticipant(event)
                          ? 'border-white/10 text-gray-400 hover:text-white hover:bg-red-500/20'
                          : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-cyan-400'
                      }`}
                    >
                       {isUserParticipant(event) ? 'Leave' : 'Join'}
                    </button>
                  </div>
                </Link>
              ))}
              {upcomingEvents.length <= 1 && (
                <div className="bg-[#0b1120] border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center flex-1 text-center">
                  <svg className="w-10 h-10 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-sm text-gray-400">No more upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* ══════════ All Events Grid ══════════ */}
          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] rounded-2xl border border-white/5">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-gray-400 text-sm max-w-md text-center">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {events.map((event) => (
                  <Link key={event._id} to={`/ride-events/${event._id}`} className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all flex flex-col">
                    <div className="h-40 relative overflow-hidden bg-black/40">
                      <img src={getImg(event)} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">
                        {event.difficulty}
                      </div>
                      {isUserParticipant(event) && (
                        <div className="absolute top-3 left-3 bg-blue-600 border border-blue-400 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider shadow-lg">
                          Joined
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white line-clamp-1 flex-1 pr-2">{event.title}</h3>
                        <span className="bg-white/5 text-gray-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5 uppercase flex-shrink-0">{event.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Date</p>
                          <p className="text-sm font-semibold text-white truncate">{formatDate(event.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Distance</p>
                          <p className="text-sm font-semibold text-white">{event.distance ? `${event.distance} km` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          {event.participantsCount} / {event.maxParticipants}
                        </div>
                        <button 
                          onClick={(e) => toggleJoin(e, event)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isUserParticipant(event)
                              ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-red-500/20'
                              : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                          }`}
                        >
                          {isUserParticipant(event) ? 'Leave' : 'Join'}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Pagination ── */}
              {(pagination?.numberOfPages >= 1) && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {/* Previous Button */}
                  <button
                    disabled={!pagination.prev}
                    onClick={() => setPage(pagination.prev)}
                    className="w-10 h-10 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.numberOfPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        page === num
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 border-none'
                          : 'bg-[#0f1629] border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 hover:bg-white/5'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    disabled={!pagination.next}
                    onClick={() => setPage(pagination.next)}
                    className="w-10 h-10 rounded-xl bg-[#0f1629] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
