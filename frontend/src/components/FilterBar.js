// frontend/src/components/FilterBar.js
import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ city: '', type: '', status: '', search: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search by name, breed..."
          value={filters.search}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
        
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;