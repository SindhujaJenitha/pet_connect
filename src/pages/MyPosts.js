// frontend/src/pages/MyPosts.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PetCard from '../components/PetCard';

const MyPosts = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, resolved

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const { data } = await api.get('/pets/my-posts');
      setPets(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const filteredPets = pets.filter(pet => {
    if (filter === 'active') return !pet.isResolved;
    if (filter === 'resolved') return pet.isResolved;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
          <Link
            to="/add-pet"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add New Post
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({pets.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({pets.filter(p => !p.isResolved).length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved ({pets.filter(p => p.isResolved).length})
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet._id} className="relative">
                <PetCard pet={pet} />
                {pet.isResolved && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ✓ Resolved
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any posts yet"
                : `No ${filter} posts found`}
            </p>
            {filter === 'all' && (
              <Link
                to="/add-pet"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;