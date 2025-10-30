// frontend/src/pages/PetDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import ShareModal from '../components/ShareModal';
import CommentSection from '../components/CommentSection';

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPet();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPet = async () => {
    try {
      const { data } = await api.get(`/pets/${id}`);
      setPet(data);
    } catch (error) {
      console.error('Error fetching pet:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/pets/${id}`);
      navigate('/my-posts');
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleMarkResolved = async () => {
    try {
      await api.put(`/pets/${id}`, { isResolved: true });
      setPet({ ...pet, isResolved: true });
      alert('Post marked as resolved!');
    } catch (error) {
      alert('Failed to update post');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet not found</h2>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user._id === pet.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  pet.status === 'Lost' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {pet.status}
                </span>
              </div>
              {pet.isResolved && (
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-gray-800 text-white">
                    ✓ Resolved
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>👁️ {pet.views} views</span>
                <span>🔗 {pet.shares} shares</span>
                <span>📅 {formatDate(pet.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{pet.name}</h1>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <span className="font-semibold w-32">Type:</span>
                  <span>{pet.type}</span>
                </div>
                {pet.breed && (
                  <div className="flex items-center">
                    <span className="font-semibold w-32">Breed:</span>
                    <span>{pet.breed}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="font-semibold w-32">Location:</span>
                  <span>{pet.location}, {pet.city}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Last Seen:</span>
                  <span>{formatDate(pet.lastSeenDate)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Contact:</span>
                  <span className="text-blue-600 font-semibold">{pet.contact}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Posted by:</span>
                  <span>{pet.userName}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  🔗 Share
                </button>

                {isOwner && !pet.isResolved && (
                  <button
                    onClick={handleMarkResolved}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    ✓ Mark Resolved
                  </button>
                )}

                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">Found this pet?</h3>
              <p className="mb-4">Please contact the owner immediately</p>
              <a
                href={`tel:${pet.contact}`}
                className="block bg-white text-blue-600 text-center px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                📞 Call Now: {pet.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection petId={pet._id} />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          pet={pet}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default PetDetail;