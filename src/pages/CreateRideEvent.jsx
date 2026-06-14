import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function CreateRideEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'group',
    meetingPoint: '',
    startDate: '',
    maxParticipants: 20,
    distance: '',
    difficulty: 'easy',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          const { data } = await axiosInstance.get(`/ride-events/${id}`);
          const event = data?.data || data;
          
          // Format date for datetime-local input (YYYY-MM-DDThh:mm)
          const formattedDate = event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '';
          
          if (event.coverImage) {
            setImagePreview(`http://localhost:8000/uploads/ride-events/${event.coverImage}`);
          }
          
          setFormData({
            title: event.title || '',
            description: event.description || '',
            type: event.type || 'group',
            meetingPoint: event.meetingPoint || '',
            startDate: formattedDate,
            maxParticipants: event.maxParticipants || 20,
            distance: event.distance || '',
            difficulty: event.difficulty || 'easy',
          });
        } catch (err) {
          console.error('Error fetching event for edit:', err);
          setError('Failed to load event details.');
        } finally {
          setFetching(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', formData.type);
      submitData.append('meetingPoint', formData.meetingPoint);
      submitData.append('startDate', formData.startDate);
      submitData.append('difficulty', formData.difficulty);
      
      if (formData.distance !== '' && formData.distance !== undefined) {
        submitData.append('distance', formData.distance);
      }
      
      if (formData.maxParticipants !== '' && formData.maxParticipants !== undefined) {
        submitData.append('maxParticipants', formData.maxParticipants);
      } else {
        submitData.append('maxParticipants', 20);
      }

      if (imageFile) {
        submitData.append('coverImage', imageFile);
      }
      
      let responseData;
      if (isEditMode) {
        const { data } = await axiosInstance.patch(`/ride-events/${id}`, submitData);
        responseData = data;
      } else {
        const { data } = await axiosInstance.post('/ride-events', submitData);
        responseData = data;
      }
      
      const eventId = isEditMode ? id : responseData?.data?.event?._id;
      navigate(`/ride-events/${eventId}`);
    } catch (err) {
      console.error('Error creating event:', err);
      const responseData = err.response?.data;
      if (responseData?.errors && responseData.errors.length > 0) {
        setError(responseData.errors.map(e => e.message).join(' | '));
      } else {
        setError(responseData?.message || 'Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      <Sidebar variant="events" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-6 lg:px-10 pt-20 pb-12 lg:py-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {isEditMode ? 'Edit Ride Event' : 'Create Ride Event'}
            </h1>
            <p className="text-gray-400">
              {isEditMode ? 'Update the details of your event below.' : 'Organize a meetup, workshop, or group ride for the Velora community.'}
            </p>
          </div>

          {fetching ? (
             <div className="flex justify-center py-12">
               <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f1629] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
            
            {/* Cover Image Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
              <div 
                className="relative group cursor-pointer w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-[#1a2540] border border-white/10 flex items-center justify-center flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">Add Cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Event Cover Image</h3>
                <p className="text-sm text-gray-400 mb-4">Upload an exciting image to attract riders to your event.</p>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-colors border border-white/10"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                minLength={3}
                maxLength={100}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Midnight Coastal Cruise"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Type</label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="group" className="bg-[#0f1629]">Group Ride</option>
                    <option value="meetup" className="bg-[#0f1629]">Meetup</option>
                    <option value="social" className="bg-[#0f1629]">Social</option>
                    <option value="workshop" className="bg-[#0f1629]">Workshop</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Difficulty</label>
                <div className="relative">
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="easy" className="bg-[#0f1629]">Easy</option>
                    <option value="medium" className="bg-[#0f1629]">Medium</option>
                    <option value="hard" className="bg-[#0f1629]">Hard</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  min={2}
                  max={500}
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Meeting Point */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Meeting Point</label>
                <input
                  type="text"
                  name="meetingPoint"
                  required
                  value={formData.meetingPoint}
                  onChange={handleChange}
                  placeholder="e.g., Downtown Cafe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Distance */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  min={0}
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Description</label>
              <textarea
                name="description"
                rows={5}
                maxLength={1000}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event, route details, rules, or anything participants should know..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-transparent text-gray-400 hover:text-white font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Publishing...
                  </>
                ) : (
                  isEditMode ? 'Save Changes' : 'Create Event'
                )}
              </button>
            </div>
            
          </form>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
