import { useState, useEffect, useCallback } from 'react';
import { getPostComments, addComment, replyToComment, getCommentReplies, toggleLikeComment, deleteComment, updateComment } from '../../api/communityService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function CommentItem({ comment, postId, onReplyAdded, onDelete }) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [currentContent, setCurrentContent] = useState(comment.content);
  
  const [isLiked, setIsLiked] = useState(
    user && comment.likes?.some(like => typeof like === 'object' ? like._id === user._id : like === user._id)
  );
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const isAuthor = user && comment.author && comment.author._id === user._id;

  const fetchReplies = useCallback(async () => {
    try {
      setLoadingReplies(true);
      const data = await getCommentReplies(comment._id);
      setReplies(data.data?.replies || []);
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setLoadingReplies(false);
    }
  }, [comment._id]);

  useEffect(() => {
    if (showReplies && replies.length === 0) {
      fetchReplies();
    }
  }, [showReplies, fetchReplies, replies.length]);

  const handleLike = async () => {
    if (!user) return;
    try {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      await toggleLikeComment(comment._id);
    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;
    
    try {
      const data = await replyToComment(comment._id, replyContent);
      // Prepend or refetch replies
      fetchReplies();
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
      if (onReplyAdded) onReplyAdded();
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group mb-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link 
          to={`/users/${comment.author?._id || ''}`} 
          onClick={(e) => !comment.author && e.preventDefault()}
          className={`flex-shrink-0 mt-1 ${!comment.author ? 'cursor-default' : ''}`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-navy-800 flex items-center justify-center text-[10px] font-bold">
            {comment.author?.profileImage ? (
              <img src={`http://localhost:8000/uploads/users/${comment.author.profileImage}`} alt={comment.author?.name || 'Unknown'} className="w-full h-full object-cover" />
            ) : (
              (comment.author?.name?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
        </Link>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-2 inline-block max-w-full">
            <Link 
              to={`/users/${comment.author?._id || ''}`} 
              onClick={(e) => !comment.author && e.preventDefault()}
              className={`text-xs font-semibold mr-2 ${comment.author ? 'hover:text-blue-400 transition-colors' : 'cursor-default'}`}
            >
              {comment.author?.name || 'Unknown Rider'}
            </Link>
            <span className="text-[10px] text-gray-500">{timeAgo(comment.createdAt)}</span>
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2 min-w-[200px]">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50 resize-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setIsEditing(false); setEditContent(currentContent); }} className="text-[10px] text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button onClick={async () => {
                    try {
                      await updateComment(comment._id, editContent);
                      setCurrentContent(editContent);
                      setIsEditing(false);
                    } catch (err) {
                      console.error('Failed to update comment', err);
                    }
                  }} className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded transition-colors">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap break-words">{currentContent}</p>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-1.5 ml-2">
            <button 
              onClick={handleLike}
              className={`text-[11px] font-medium transition-colors ${isLiked ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Like {likesCount > 0 && `(${likesCount})`}
            </button>
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-300 transition-colors"
            >
              Reply
            </button>
            
            {/* Show Replies Button (if it's a top level comment and we have a way to know if replies exist... the API doesn't return reply count easily, so we can just show the button always or if we want) */}
            {!comment.parentComment && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="text-[11px] font-medium text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showReplies ? 'Hide replies' : 'View replies'}
              </button>
            )}

            {isAuthor && (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] font-medium text-gray-500 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Edit
              </button>
            )}
            
            {isAuthor && (
              <button 
                onClick={() => onDelete(comment._id)}
                className="text-[11px] font-medium text-red-500/70 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-navy-800 flex items-center justify-center flex-shrink-0 mt-1 text-[8px] font-bold">
                {user?.profileImage ? (
                  <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.charAt(0) || 'U').toUpperCase()
                )}
              </div>
              <div className="flex-1 flex items-center bg-white/5 rounded-full px-3 py-1 border border-white/5 focus-within:border-blue-500/30 transition-colors">
                <input 
                  type="text" 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 placeholder-gray-500"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {showReplies && (
            <div className="mt-4 border-l border-white/10 pl-4 ml-1">
              {loadingReplies ? (
                <div className="text-[11px] text-gray-500">Loading replies...</div>
              ) : replies.length > 0 ? (
                replies.map(reply => (
                  <CommentItem 
                    key={reply._id} 
                    comment={reply} 
                    postId={postId} 
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="text-[11px] text-gray-500">No replies yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPostComments(postId);
      setComments(data.data?.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      await addComment(postId, newComment);
      setNewComment('');
      fetchComments(); // Refresh list
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Brute force refresh for simplicity, though could just remove from state
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="bg-navy-950/50 p-4 border-t border-white/5">
      {/* Add Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-navy-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-1">
            {user?.profileImage ? (
              <img src={`http://localhost:8000/uploads/users/${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user?.name?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none overflow-hidden min-h-[44px]"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
              }}
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-2 bottom-2.5 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5 -rotate-90 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-3 bg-white/5 rounded-xl text-center">
          <p className="text-sm text-gray-400">
            Please <Link to="/login" className="text-blue-400 hover:underline">login</Link> to join the conversation.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-1">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              postId={postId} 
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
