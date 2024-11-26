"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from 'react';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when the page loads
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []); // This runs only once on initial load


  console.log(` fav is ${favorites}`);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold pt-24 px-4">My List</h1>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div key={movie.id || movie.trackName} className="flex flex-col">
              <div
                className="relative group rounded-lg overflow-hidden shadow-md bg-gray-800 hover:bg-gray-700 transition duration-300"
              >
                {/* Movie Thumbnail */}
                <Image
                  src={movie.artworkUrl1000 || '/placeholder-image.png'} // Use a default placeholder if the movie image is missing
                  alt={movie.trackName}
                  width={200}
                  height={300}
                  className="object-cover w-full h-72 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>

                {/* Movie Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-sm font-medium">
                  <p className="truncate">{movie.trackName}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No movies in your list yet. Add some to see them here!
          </p>
        )}
      </div>
    </div>
  );
}
