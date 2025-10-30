// frontend/src/components/ShareModal.js
import React, { useState } from 'react';
import api from '../utils/api';

const ShareModal = ({ pet, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/pet/${pet._id}`;

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      await api.put(`/pets/${pet._id}/share`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = async (platform) => {
    const text = `Help find this ${pet.status.toLowerCase()} ${pet.type.toLowerCase()}: ${pet.name}`;
    let url;

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    await api.put(`/pets/${pet._id}/share`);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Share this post</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-2xl mb-1">💬</span>
              <span className="text-xs">WhatsApp</span>
            </button>

            <button
              onClick={() => handleSocialShare('facebook')}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-2xl mb-1">📘</span>
              <span className="text-xs">Facebook</span>
            </button>

            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-2xl mb-1">🐦</span>
              <span className="text-xs">Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;