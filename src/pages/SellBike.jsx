import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function SellBike() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'motorcycle',
    price: '',
    condition: 'used',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('You can only upload up to 5 images.');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Because we are sending files, we must use FormData
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('condition', formData.condition);
      data.append('location', formData.location);

      images.forEach((image) => {
        data.append('images', image);
      });

      await axiosInstance.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/garage'); // Redirect to garage after success
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Failed to list the product. Please try again.');
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Sell Your Machine</h1>
            <p className="text-gray-400">List your motorcycle, parts, or gear to thousands of riders in the Velora community.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f1629] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
            
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
                placeholder="e.g., 2024 Ducati Panigale V4 S"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="motorcycle" className="bg-[#0f1629]">Motorcycle</option>
                    <option value="parts" className="bg-[#0f1629]">Parts</option>
                    <option value="accessories" className="bg-[#0f1629]">Accessories</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Condition</label>
                <div className="relative">
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="new" className="bg-[#0f1629]">New</option>
                    <option value="used" className="bg-[#0f1629]">Used</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min={0}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Cairo, Egypt"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Description</label>
              <textarea
                name="description"
                required
                minLength={10}
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item in detail. Include condition, history, specs, and any modifications..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                Images <span className="text-gray-600 normal-case font-normal tracking-normal">(Max 5 images)</span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black group">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover opacity-80" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}

                {imagePreviews.length < 5 && (
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span className="text-xs text-gray-400 font-semibold">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
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
                  'Publish Listing'
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}
