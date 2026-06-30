import { useState, useEffect } from 'react';
import { getTrendingHashtags, getTrendingPosts } from '../../api/communityService';
import { Link, useNavigate } from 'react-router-dom';

export default function TrendingSidebar({ currentHashtag }) {
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const [tagsRes, postsRes] = await Promise.all([
          getTrendingHashtags(),
          getTrendingPosts()
        ]);
        setHashtags(tagsRes.data?.hashtags || []);
        setTrendingPosts(postsRes.data?.posts || []);
      } catch (err) {
        console.error('Error fetching trending data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-3 bg-white/5 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending Tags
          </h3>
        </div>
        <div className="p-2">
          {hashtags.length > 0 ? (
            <div className="flex flex-col">
              {hashtags.map((tag) => (
                <Link
                  key={tag.tag}
                  to={`/community?hashtag=${tag.tag}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${currentHashtag === tag.tag ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="text-sm font-medium truncate">#{tag.tag}</span>
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{tag.count} posts</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">No trending tags right now.</p>
          )}
        </div>
      </div>

      {/* Trending Posts Mini */}
      <div className="bg-[#0b1120]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            Top Posts
          </h3>
        </div>
        <div className="p-2">
          {trendingPosts.length > 0 ? (
            <div className="flex flex-col gap-1">
              {trendingPosts.map((post) => (
                <div key={post._id} className="p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate(`/community/post/${post._id}`)}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-navy-800">
                      {post.author?.profileImage ? (
                        <img src={`http://localhost:8000/uploads/users/${post.author.profileImage}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white bg-blue-600">
                          {post.author?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-blue-400 transition-colors">{post.author?.name || 'Unknown'}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><svg className="w-3 h-3 text-red-400/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> {post.likesCount}</span>
                    <span className="flex items-center gap-1"><svg className="w-3 h-3 text-blue-400/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg> {post.commentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">No top posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
