// frontend/src/components/PetCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/pet/${pet._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              pet.status === 'Lost' 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {pet.status}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">Type:</span> {pet.type}</p>
            {pet.breed && <p><span className="font-semibold">Breed:</span> {pet.breed}</p>}
            <p><span className="font-semibold">Location:</span> {pet.location}, {pet.city}</p>
            <p><span className="font-semibold">Posted:</span> {formatDate(pet.createdAt)}</p>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>👁️ {pet.views} views</span>
            <span>🔗 {pet.shares} shares</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;