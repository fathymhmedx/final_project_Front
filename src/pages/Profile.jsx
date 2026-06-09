import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import Button from '../components/Button';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bikeType: user?.bikeType || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Set initial image preview if user already has an avatar
  useEffect(() => {
    if (user?.profileImage) {
      setImagePreview(`http://localhost:8000/uploads/users/${user.profileImage}`);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('bikeType', formData.bikeType);
    submitData.append('location', formData.location);
    submitData.append('bio', formData.bio);
    
    if (imageFile) {
      submitData.append('profileImage', imageFile);
    }

    const result = await updateProfile(submitData);
    
    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.scrollTo(0, 0);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
      window.scrollTo(0, 0);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-blue-500/30">
      {/* Navbar (reused simplified version) */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex-shrink-0">
                <img src={logo} alt="Velora" className="h-8 w-auto" />
              </Link>
              <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-400">
                <Link to="/home" className="hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-5 text-gray-400">
              <div className="relative group cursor-pointer pl-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-white/10">
                  {user?.profileImage ? (
                    <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name?.charAt(0) || 'U').toUpperCase()
                  )}
                </div>
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Update your personal details and public rider identity.</p>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl border text-sm ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/5">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#1a2540] border-2 border-white/10 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                  ) : (
                    <span className="text-4xl text-gray-500 font-bold">
                      {(formData.name.charAt(0) || 'U').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                <h3 className="text-lg font-bold text-white mb-1">Profile Photo</h3>
                <p className="text-sm text-gray-400 mb-4">Upload a high-res image to stand out in the community.</p>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 px-4 border border-white/10 text-sm"
                >
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed directly.</p>
              </div>

              {/* Bike Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Motorcycle</label>
                <input
                  type="text"
                  name="bikeType"
                  value={formData.bikeType}
                  onChange={handleChange}
                  placeholder="e.g. 2024 Ducati Panigale V4"
                  className={inputClass}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Los Angeles, CA"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the community about yourself, your riding experience, and what you love about motorcycles."
                rows="4"
                className={`${inputClass} resize-none`}
              ></textarea>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
