import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommentSection from './CommentSection';
import { useAuth } from '../../context/AuthContext';

// ─── Lightbox Modal ────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  // Prevent scroll on body while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={`http://localhost:8000/uploads/posts/${images[current].url}`}
        alt={`Image ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-blue-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img
                src={`http://localhost:8000/uploads/posts/${img.url}`}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PostCard ──────────────────────────────────────────────────────────────────
export default function PostCard({ 
  post, 
  onLikeToggle, 
  onBookmarkToggle,
  onDelete,
  onEdit,
  onCommentAdded
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed
  
  const isAuthor = user && post.author._id === user._id;
  const isLiked = user && post.likes.some(like => {
    return typeof like === 'object' ? like._id === user._id : like === user._id;
  });
  const isBookmarked = user && (post.bookmarks || []).some(id => id?.toString() === user._id?.toString());

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);
    await onLikeToggle(post._id);
    setIsLiking(false);
  };

  const handleBookmark = () => {
    if (!user) return;
    onBookmarkToggle(post._id);
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const renderContent = (content) => {
    if (!content) return null;
    const parts = content.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Link 
            key={index} 
            to={`/community?hashtag=${part.substring(1).toLowerCase()}`}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {part}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const imgClass = "w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-200";

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && post.images?.length > 0 && (
        <Lightbox images={post.images} startIndex={lightboxIndex} onClose={closeLightbox} />
      )}

      <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg shadow-black/20 mb-6 animate-fade-in">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <Link to={`/users/${post.author._id}`} className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-navy-950 flex items-center justify-center text-xs font-bold">
                {post.author.profileImage ? (
                  <img 
                    src={`http://localhost:8000/uploads/users/${post.author.profileImage}`} 
                    alt={post.author.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                ) : (
                  (post.author.name?.charAt(0) || 'U').toUpperCase()
                )}
              </div>
            </Link>
            <div>
              <Link to={`/users/${post.author._id}`} className="text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5">
                {post.author.name}
                {post.author.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
              <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span>{post.author.rank || 'Rider'}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setIsEditing(!isEditing); setEditContent(post.content); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                title="Edit post"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(post._id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div 
          className="px-4 pb-3 cursor-pointer" 
          onClick={(e) => {
            if (e.target.tagName !== 'A' && !isEditing) {
              navigate(`/community/post/${post._id}`);
            }
          }}
        >
          {isEditing ? (
            <div className="mt-2 cursor-default" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none min-h-[80px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (onEdit) await onEdit(post._id, editContent);
                    setIsEditing(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-gray-200 whitespace-pre-wrap leading-relaxed group-hover:text-white transition-colors">
              {renderContent(post.content)}
            </p>
          )}
        </div>

        {/* Images Grid — clickable to open lightbox */}
        {post.images && post.images.length > 0 && (
          <div className="mt-2 overflow-hidden">
            {post.images.length === 1 && (
              <img
                src={`http://localhost:8000/uploads/posts/${post.images[0].url}`}
                alt="Post"
                className="w-full max-h-[500px] object-cover cursor-pointer hover:brightness-90 transition-all duration-200"
                onClick={() => openLightbox(0)}
              />
            )}
            {post.images.length === 2 && (
              <div className="grid grid-cols-2 gap-0.5">
                {post.images.map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    <img src={`http://localhost:8000/uploads/posts/${img.url}`} alt="Post" className={imgClass} onClick={() => openLightbox(i)} />
                  </div>
                ))}
              </div>
            )}
            {post.images.length === 3 && (
              <div className="grid grid-cols-2 gap-0.5">
                <div className="row-span-2 overflow-hidden aspect-[3/4]">
                  <img src={`http://localhost:8000/uploads/posts/${post.images[0].url}`} alt="Post" className={imgClass} onClick={() => openLightbox(0)} />
                </div>
                <div className="overflow-hidden aspect-square">
                  <img src={`http://localhost:8000/uploads/posts/${post.images[1].url}`} alt="Post" className={imgClass} onClick={() => openLightbox(1)} />
                </div>
                <div className="overflow-hidden aspect-square">
                  <img src={`http://localhost:8000/uploads/posts/${post.images[2].url}`} alt="Post" className={imgClass} onClick={() => openLightbox(2)} />
                </div>
              </div>
            )}
            {post.images.length >= 4 && (
              <div className="grid grid-cols-2 gap-0.5">
                {post.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden relative">
                    <img src={`http://localhost:8000/uploads/posts/${img.url}`} alt="Post" className={imgClass} onClick={() => openLightbox(i)} />
                    {i === 3 && post.images.length > 4 && (
                      <div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                        onClick={() => openLightbox(3)}
                      >
                        <span className="text-white text-2xl font-bold">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-red-500/10 transition-colors ${isLiked ? 'animate-heartbeat' : ''}`}>
                <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{post.likesCount || 0}</span>
            </button>

            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 transition-colors group ${showComments ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'}`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                <svg className={`w-5 h-5 ${showComments ? 'fill-blue-500/20' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{post.commentsCount || 0}</span>
            </button>
          </div>

          <button 
            onClick={handleBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
          >
            <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentSection 
            postId={post._id} 
            onCommentAdded={() => onCommentAdded && onCommentAdded(post._id)}
          />
        )}
      </div>
    </>
  );
}
