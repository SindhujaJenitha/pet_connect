// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PetCard from '../components/PetCard';
import FilterBar from '../components/FilterBar';

const Home = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchPets();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const { data } = await api.get(`/pets?${params.toString()}`);
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Lost Pet 🐾</h1>
          <p className="text-xl mb-2">Help reunite pets with their families</p>
          <p className="text-blue-100">Search through {pets.length} posts from your community</p>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Pet Grid */}
        {!loading && pets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No pets found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;