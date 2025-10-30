// frontend/src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold">PetConnect</h1>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/add-pet" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                  + Add Post
                </Link>
                <Link to="/my-posts" className="hover:text-blue-200 transition">
                  My Posts
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;