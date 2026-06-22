import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/community/PostCard';
import TrendingSidebar from '../components/community/TrendingSidebar';
import { getPost, toggleLikePost, toggleBookmarkPost, deletePost, updatePost } from '../api/communityService';
import { useAuth } from '../context/AuthContext';

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPost(id);
        if (response?.data?.post) {
          setPost(response.data.post);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeToggle = async (postId) => {
    try {
      const res = await toggleLikePost(postId);
      setPost(prev => ({
        ...prev,
        likesCount: res.data.likesCount,
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmarkToggle = async (postId) => {
    try {
      const res = await toggleBookmarkPost(postId);
      const isNowBookmarked = res?.data?.isBookmarked;
      
      setPost(prev => {
        const userId = user?._id?.toString();
        const current = (prev.bookmarks || []).map(bId => bId?.toString());
        const updated = isNowBookmarked
          ? (current.includes(userId) ? current : [...current, userId])
          : current.filter(bId => bId !== userId);
        return { ...prev, bookmarks: updated };
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      navigate('/community', { replace: true });
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEditPost = async (postId, newContent) => {
    try {
      await updatePost(postId, { content: newContent });
      setPost(prev => ({ ...prev, content: newContent }));
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post.');
    }
  };

  const handleCommentAdded = () => {
    setPost(prev => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
  };

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar variant="events" />

      <main className="flex-1 flex justify-center py-6 px-4 sm:px-6 lg:px-8 h-screen overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white tracking-tight">Post Details</h1>
          </div>

          {loading ? (
            <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 animate-pulse h-64">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded"></div>
                  <div className="h-2 w-16 bg-white/5 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full bg-white/10 rounded"></div>
                <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                <div className="h-3 w-4/6 bg-white/10 rounded"></div>
              </div>
            </div>
          ) : post ? (
            <PostCard 
              post={post} 
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              onCommentAdded={handleCommentAdded}
            />
          ) : (
            <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Post not found</h3>
              <p className="text-sm text-gray-400">The post you are looking for does not exist or has been deleted.</p>
            </div>
          )}
        </div>
      </main>

      <aside className="w-80 flex-shrink-0 hidden xl:block border-l border-white/5 p-6 h-screen overflow-y-auto scrollbar-hide">
        <TrendingSidebar />
      </aside>
    </div>
  );
}
