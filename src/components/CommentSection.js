// frontend/src/components/CommentSection.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const CommentSection = ({ petId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [petId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${petId}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/comments', {
        petId,
        text: newComment
      });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      alert('Failed to add comment');
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {!user && (
        <p className="text-gray-600 mb-6">Please login to comment</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="border-b border-gray-200 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-800">{comment.userName}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
              {user && user._id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500 hover:text-red-700 text-sm ml-4"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;