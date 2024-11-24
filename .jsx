'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

export default function Movie({ params }) {
  const { id } = React.use(params);
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movie');
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
  }, [id]);

  useEffect(() => {
    if (movies && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play(); // Attempt to play the video
        } catch (err) {
          console.warn('Video playback was prevented:', err);
        }
      };
      playVideo();
    }
  }, [movies]); // Re-run when `movies` changes

  const toggleFullScreen = () => {
    const videoElement = document.getElementById('movie-video');

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    }

    setIsFullScreen(!isFullScreen);
  };

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  if (!movies) {
    return <div className="text-4xl text-white text-center py-8">Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <video
        id="movie-video"
        className="w-full h-full object-cover"
        src={movies.previewUrl}
        controls
        ref={videoRef}
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
