// frontend/src/pages/AddPet.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddPet = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    status: 'Lost',
    description: '',
    location: '',
    city: '',
    contact: '',
    lastSeenDate: new Date().toISOString().split('T')[0]
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please upload a pet image');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('image', image);

    try {
      await api.post('/pets', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Pet Post</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pet Photo *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">📸</div>
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
                        Choose Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 mt-2 text-sm">Max size: 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Lost"
                    checked={formData.status === 'Lost'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-red-600 font-semibold">Lost</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Found"
                    checked={formData.status === 'Found'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-green-600 font-semibold">Found</span>
                </label>
              </div>
            </div>

            {/* Pet Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Golden Retriever"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Near Central Park"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mumbai"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Seen Date</label>
              <input
                type="date"
                name="lastSeenDate"
                value={formData.lastSeenDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the pet's appearance, behavior, any distinguishing features..."
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Contact Info *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number or email"
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating Post...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;