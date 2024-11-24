"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const ProgressiveImageCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white transition-all hover:scale-105 hover:shadow-xl">
      <Link href={`/movies/${movie.trackId}`}>
        <div className="relative w-full h-56 sm:h-64"> {/* Adjusted height for better visibility */}

          {/* Movie Image with hover effect */}
          <div className="relative group w-full h-full">

            {/* Static movie image with hover effect */}
            <Image
              src={movie.artworkUrl30}
              width={200}
              height={200}
              alt={'movie'}
              className="transition-opacity duration-300 object-cover group-hover:opacity-0"
            />

            {/* Overlay with Movie Information */}
            <div className='absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300'>
              <div className='text-white text-center px-4 py-2'>
                <h2 className="text-lg font-semibold mb-2">{movie.trackName}</h2>
                <h3 className="text-sm mb-1">{movie.artistName}</h3>
                <h3 className="text-sm mb-2">{movie.primaryGenreName}</h3>
                <button className='bg-green-600 p-2 text-white mt-2 rounded'>Watch Now</button>
              </div>
            </div>

            {/* Fallback movie image */}
            <Image
              src={movie.artworkUrl30}
              alt={movie.trackName}
              layout="fill"
              objectFit="fit"
              className={`transition-opacity duration-300 ${imageLoaded ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src={movie.artworkUrl1000 || movie.artworkUrl500}
              alt={movie.trackName}
              layout="fill"
              objectFit="fit"
              className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Movie Title */}
          <div className="p-4">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{movie.trackName}</h2>
          </div>

        </div>
      </Link>
    </div>

  );
};

const HomeMovie = () => {
  const [movies, setMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [error, setError] = useState(null);

  // Fetching the movie data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movie');

        if (response.data && response.data.results) {
          setMovies(response.data.results);
          setVisibleMovies(response.data.results.slice(0, 12)); // Initially show the first 12 images
        } else {
          setError('No movies found');
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies');
      }
    };

    fetchMovies();
  }, []);

  // Set an interval to transition images every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisibleMovies((prevMovies) => {
        const nextIndex = (movies.indexOf(prevMovies[11]) + 1) % movies.length; // Find the next set of 12 images
        return movies.slice(nextIndex, nextIndex + 12); // Show the next 12 images in sequence
      });
    }, 5000); // Transition every 3 seconds

    return () => clearInterval(intervalId);
  }, [movies]);

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  if (!movies.length) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 14h4zm2 5.291V20a10.015 10.015 0 0114-5.709l-1.5-1.5A8.015 8.015 0 006 17.291z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">Movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-white mb-8">Latest Movies</h1>
      {/* Movie Grid Component with 2 rows and 6 columns */}
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleMovies.map((movie, index) => (
          <ProgressiveImageCard key={movie.trackId} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default HomeMovie;
