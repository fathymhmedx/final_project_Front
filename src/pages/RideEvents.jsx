import React from 'react';
import Sidebar from '../components/Sidebar';
import rideHeroImg from '../assets/ride_events_hero.png';
import nearbyRidesImg from '../assets/nearby_rides_map.png';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';

export default function RideEvents() {
  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* ── Sidebar ── */}
      <Sidebar variant="events" />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-20 pb-10 lg:py-10">

          {/* ══════════ Hero Section ══════════ */}
          <div className="relative w-full h-[320px] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
            <img 
              src={rideHeroImg} 
              alt="Ride Events Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 via-[#0a0e1a]/50 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 mb-3 uppercase">Upcoming Gatherings</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
                Ride Events
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed mb-8 drop-shadow">
                Connect with the community, explore new routes, and join the elite Velora riders on the open road.
              </p>
              <div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-100 hover:bg-white text-blue-900 font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Create Event
                </button>
              </div>
            </div>
          </div>

          {/* ══════════ Main Content Grid ══════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* ── Nearby Rides (Left - Takes 2 Columns) ── */}
            <div className="lg:col-span-2 bg-[#0b1120] border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Nearby Rides</h2>
                  <p className="text-gray-400 text-sm">Active routes and meetups within 50 miles</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </button>
                </div>
              </div>

              <div className="relative flex-1 w-full min-h-[350px] rounded-2xl overflow-hidden border border-white/5">
                <img 
                  src={nearbyRidesImg} 
                  alt="Map" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-lighten"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-[#0a0e1a]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Live: 12 Riders on Route</span>
                </div>

                {/* Map Pin */}
                <div className="absolute top-[45%] left-[40%] bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center animate-pulse">
                  <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg shadow-blue-500/50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column (Recommended & Clinic) ── */}
            <div className="flex flex-col gap-6">
              
              {/* Recommended Event */}
              <div className="bg-[#0f1629] border border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-0"></div>
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase mb-3 block">Recommended For You</span>
                  <h3 className="text-xl font-bold text-white mb-4">Midnight Coastal Cruise</h3>
                  
                  {/* Avatars */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex -space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#0f1629] overflow-hidden"><img src={img1} alt="User" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#0f1629] overflow-hidden"><img src={img2} alt="User" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#0f1629] overflow-hidden"><img src={rideHeroImg} alt="User" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full bg-[#1a2540] border-2 border-[#0f1629] flex items-center justify-center text-[10px] font-bold text-gray-300">+24</div>
                    </div>
                    <span className="text-xs text-gray-400">riders attending</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Friday, Oct 24 • 8:00 PM
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Santa Monica Pier, Gate 2
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-white/5 hover:bg-blue-500/20 text-white hover:text-blue-400 font-semibold rounded-xl border border-white/10 hover:border-blue-500/30 transition-all z-10">
                  Join Event
                </button>
              </div>

              {/* Maintenance Clinic */}
              <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all flex-1 flex flex-col">
                <div className="h-32 bg-gray-800 overflow-hidden relative">
                  <img src={img2} alt="Clinic" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500 grayscale" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-white mb-2">Weekend Maintenance Clinic</h3>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">Learn advanced track-day prep and engine tuning from Velora specialists.</p>
                  <button className="mt-auto text-xs font-bold text-blue-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                    View Details <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ══════════ Bottom Grid (Events List) ══════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all">
              <div className="h-40 relative overflow-hidden">
                <img src={img1} alt="Event" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">Advanced</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">Peak District Loop</h3>
                  <span className="bg-white/5 text-gray-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5 uppercase">Group Ride</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Distance</p>
                    <p className="text-sm font-semibold text-white">142 mi</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Difficulty</p>
                    <p className="text-sm font-semibold text-white">4/5</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    42 Attending
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all">
              <div className="h-40 relative overflow-hidden bg-[#1a2540]">
                 <img src={rideHeroImg} alt="Event" className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">Social</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white w-2/3">Sunrise Coffee Run</h3>
                  <span className="bg-white/5 text-gray-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5 uppercase">Meetup</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Time</p>
                    <p className="text-sm font-semibold text-white">06:00 AM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Riders</p>
                    <p className="text-sm font-semibold text-white">15/20</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Starts in 14h
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all">
              <div className="h-40 relative overflow-hidden bg-black/50">
                 <img src={img2} alt="Event" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">Workshop</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white w-2/3">Customization Workshop</h3>
                  <span className="bg-white/5 text-gray-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5 uppercase">Garage</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Duration</p>
                    <p className="text-sm font-semibold text-white">4 hrs</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Cost</p>
                    <p className="text-sm font-semibold text-green-400">FREE</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Velora Garage Hub
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
