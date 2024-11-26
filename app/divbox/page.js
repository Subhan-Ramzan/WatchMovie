'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-gray-500'
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage initially
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (color) => {
    const updatedFavorites = favorites.includes(color)
      ? favorites.filter((fav) => fav !== color)
      : [...favorites, color];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update localStorage
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Select Your Favorite Boxes</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-20 h-20 rounded-lg ${color} cursor-pointer`}
            onClick={() => toggleFavorite(color)}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
              {favorites.includes(color) ? '★' : '☆'}
            </div>
          </div>
        ))}
      </div>
      <Link href="/favorites">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Go to Favorites ({favorites.length})
        </button>
      </Link>
    </div>
  );
}
