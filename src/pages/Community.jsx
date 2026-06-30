import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/community/PostCard';
import CreatePostCard from '../components/community/CreatePostCard';
import TrendingSidebar from '../components/community/TrendingSidebar';
import { getPosts, getMyPosts, getMyBookmarks, toggleLikePost, toggleBookmarkPost, deletePost, updatePost } from '../api/communityService';
import { useAuth } from '../context/AuthContext';

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hashtagParam = searchParams.get('hashtag');
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // all, following, my_posts, bookmarks
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileTrendingOpen, setMobileTrendingOpen] = useState(false);
  const [toastError, setToastError] = useState('');

  const showError = (msg) => {
    setToastError(msg);
    setTimeout(() => setToastError(''), 5000);
  };

  const fetchPostsData = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      let response;
      const params = { page: pageNum, limit: 10 };

      if (hashtagParam) {
        params.hashtag = hashtagParam;
        response = await getPosts(params);
        setActiveTab('all'); // Force tab to all when searching by hashtag
      } else if (activeTab === 'all') {
        response = await getPosts(params);
      } else if (activeTab === 'following') {
        params.following = 'true';
        response = await getPosts(params);
      } else if (activeTab === 'my_posts') {
        response = await getMyPosts(params);
      } else if (activeTab === 'bookmarks') {
        response = await getMyBookmarks(); // Currently doesn't support pagination in backend fully, but we'll call it
      }

      const fetchedPosts = response?.data?.posts || [];
      
      if (shouldAppend) {
        setPosts(prev => [...prev, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }

      // Check if we have more pages
      if (response?.pagination?.next || (fetchedPosts.length === 10)) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, hashtagParam]);

  // Initial fetch and dependency changes
  useEffect(() => {
    setPage(1);
    fetchPostsData(1, false);
  }, [fetchPostsData]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPostsData(nextPage, true);
  };

  const handlePostCreated = () => {
    if (activeTab !== 'all' && activeTab !== 'my_posts') {
      setActiveTab('all');
    } else {
      setPage(1);
      fetchPostsData(1, false);
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      // Optimistic update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.some(l => typeof l === 'object' ? l._id === window.user?._id : l === window.user?._id); // We don't have user here easily without context, but server returns accurate count anyway if we just refetch, or we can use the response
          // A safer optimistic update: just wait for response
        }
        return post;
      }));

      const res = await toggleLikePost(postId);
      
      // Update with actual data from response
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likesCount: res.data.likesCount,
            // the likes array would technically need updating too if we relied on it deeply, but we can rely on what we have or refetch
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleBookmarkToggle = async (postId) => {
    try {
      const res = await toggleBookmarkPost(postId);
      // res = { status, message, data: { isBookmarked } }
      const isNowBookmarked = res?.data?.isBookmarked;
      
      if (activeTab === 'bookmarks' && !isNowBookmarked) {
        // Remove from bookmarks tab immediately
        setPosts(prev => prev.filter(post => post._id !== postId));
        return;
      }

      // Update the bookmarks array of the post using backend truth
      setPosts(prev => prev.map(post => {
        if (post._id !== postId) return post;
        const userId = user?._id?.toString();
        const current = (post.bookmarks || []).map(id => id?.toString());
        const updated = isNowBookmarked
          ? (current.includes(userId) ? current : [...current, userId])
          : current.filter(id => id !== userId);
        return { ...post, bookmarks: updated };
      }));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEditPost = async (postId, newContent) => {
    try {
      await updatePost(postId, { content: newContent });
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return { ...post, content: newContent };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error updating post:', err);
      showError(err?.response?.data?.message || 'Failed to update post.');
    }
  };

  const handleCommentAdded = (postId) => {
    // Increment comment count locally
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        return { ...post, commentsCount: (post.commentsCount || 0) + 1 };
      }
      return post;
    }));
  };

  const clearHashtagFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="flex min-h-screen bg-navy-950">
      {/* Left Sidebar */}
      <Sidebar variant="events" />

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center pt-20 pb-6 lg:py-6 px-4 sm:px-6 lg:px-8 h-screen overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-3xl">
          

          {/* Toast Error */}
          {toastError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-red-400">{toastError}</p>
            </div>
          )}

          {/* Create Post */}
          <CreatePostCard onPostCreated={handlePostCreated} />


          {/* Feed Tabs & Hashtag Filter Info */}
          <div className="mb-6">
            {hashtagParam ? (
              <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-blue-400">
                  Showing results for <span className="font-bold">#{hashtagParam}</span>
                </span>
                <button 
                  onClick={clearHashtagFilter}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="flex gap-2 p-1 bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-xl inline-flex">
                {[
                  { id: 'all', label: 'All Posts' },
                  { id: 'following', label: 'Following' },
                  { id: 'my_posts', label: 'My Posts' },
                  { id: 'bookmarks', label: 'Bookmarks' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 animate-pulse h-64">
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
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onLikeToggle={handleLikeToggle}
                    onBookmarkToggle={handleBookmarkToggle}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                    onCommentAdded={handleCommentAdded}
                  />
                ))}
              </div>
              
              {/* Load More */}
              {hasMore && (
                <div className="mt-8 mb-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingMore && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    Load More Posts
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
              <p className="text-sm text-gray-400">
                {hashtagParam 
                  ? `No posts found with hashtag #${hashtagParam}`
                  : activeTab === 'following' 
                    ? "You aren't following anyone with posts yet."
                    : activeTab === 'my_posts'
                      ? "You haven't created any posts yet."
                      : activeTab === 'bookmarks'
                        ? "You haven't bookmarked any posts yet."
                        : "There are no posts here yet. Be the first to share something!"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar (Trending) - Hidden on mobile/tablet */}
      <aside className="w-80 flex-shrink-0 hidden xl:block border-l border-white/5 p-6 h-screen overflow-y-auto scrollbar-hide">
        <TrendingSidebar currentHashtag={hashtagParam} />
      </aside>

      {/* Mobile Trending FAB */}
      <button 
        onClick={() => setMobileTrendingOpen(true)}
        className="xl:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      </button>

      {/* Mobile Trending Bottom Sheet */}
      {mobileTrendingOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileTrendingOpen(false)}></div>
          <div className="relative bg-[#0b1120] w-full max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 pb-10 animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
            </div>
            <TrendingSidebar currentHashtag={hashtagParam} />
          </div>
        </div>
      )}
    </div>
  );
}
