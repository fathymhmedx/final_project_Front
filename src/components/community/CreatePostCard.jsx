import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../api/communityService';
import { Link } from 'react-router-dom';

export default function CreatePostCard({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Join the conversation</h3>
        <p className="text-sm text-gray-400 mb-4">Log in to share your rides, ask questions, and connect with other riders.</p>
        <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors">
          Login to Post
        </Link>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can only upload up to 5 images per post.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      images.forEach(img => {
        formData.append('images', img);
      });

      await createPost(formData);
      
      // Reset form
      setContent('');
      setImages([]);
      previews.forEach(p => URL.revokeObjectURL(p));
      setPreviews([]);
      
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
      const message = err?.response?.data?.message || 'Failed to create post. Please try again.';
      setError(message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg mb-6 p-4">
      {error && (
        <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-800 flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 border-white/5">
            {user.profileImage ? (
              <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user.name?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your ride, thoughts, or ask a question... (Use #hashtags)"
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[60px] text-sm mt-1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
              }}
            />
          </div>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="mt-3 ml-13 flex flex-wrap gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 ml-13 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-500/10 transition-colors"
              title="Add Image"
              disabled={images.length >= 5}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <span className="text-[11px] text-gray-500">{images.length}/5 images</span>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (!content.trim() && images.length === 0)}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-1.5 rounded-full transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
