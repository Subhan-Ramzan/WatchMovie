'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure you have axios installed

export default function Movie({ params }) {
  // Unwrap `params` to access the id
  const { id } = React.use(params);  // Unwrap the Promise to get the actual value

  const [movies, setMovies] = useState(null);  // Store movie data here
  const [error, setError] = useState(null);  // Handle errors

  // Fetch the movie data when the component loads
  useEffect(() => {
    if (!id) return;  // Avoid fetching if `id` is not available

    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movie');  // Adjust API endpoint if needed
        if (response.data && response.data.results) {
          const fetchMovie = response.data.results;
          const movie = fetchMovie.find((m) => m.trackId.toString() === id);
          setMovies(movie);
        } else {
          setError('No movie found');
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to fetch movie');
      }
    };

    fetchMovies();
  }, [id]);  // Only re-run if `id` changes

  // Fullscreen toggle
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const videoElement = document.getElementById("movie-video");

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) { // Safari
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.mozRequestFullScreen) { // Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.msRequestFullscreen) { // IE/Edge
        videoElement.msRequestFullscreen();
      }
    }

    setIsFullScreen(!isFullScreen);
  };

  // Handle loading and error states
  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  if (!movies) {
    return <div className="text-4xl text-black text-center py-8">Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <video
        id="movie-video"
        className="w-full h-full object-cover"
        src={movies.previewUrl}  // Correctly reference the `previewUrl`
        controls
      />

      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full shadow-lg"
      >
        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
      </button>
    </div>
  );
}
