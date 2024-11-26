'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaHeart, FaShareAlt, FaDownload, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import "./global.css";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { FaRegCircleUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Movie({ params }) {

  const { id } = React.use(params);
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage initially
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };


  useEffect(() => {
    console.log("status:", status); // Debugging line
    console.log("userData:", userData); // Debugging line

    const fetchCookieData = async () => {
      try {
        const response = await axios.get("/api/protected", {
          withCredentials: true,
        });
        setUserData(response.data.user);
        const user = response.data.user;
        const id = user.id;

        if (id) {
          const imageResponse = await axios.get(`/api/profileimage/${id}`);
          setPublicId(imageResponse.data.public_id);
        } else {
          console.log("No user ID found; skipping profile image fetch");
        }
      } catch (error) {
        console.log("Failed to fetch protected data:", error);
        setUserData(null);
        console.log("User data set to null due to fetch error");
      }
    };

    if (status === "unauthenticated" && userData === null) {
      fetchCookieData();
    }
  }, [status, userData, router]);

  const toggleAddToList = () => {
    setAdded(!added);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  useEffect(() => {
    if (!id) return;

    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movie');
        if (response.data && response.data.results) {
          const fetchMovie = response.data.results;
          const movie = fetchMovie.find((m) => m.trackId.toString() === id);
          setMovies(movie);

          if (movie) {
            fetchRelatedMovies(movie.trackName, fetchMovie);
          }
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

  const fetchRelatedMovies = (trackName, movieList) => {
    if (!trackName) return;

    const words = trackName.split(' ');
    const related = movieList.filter((m) => {
      return words.some(
        (word) =>
          m.trackName?.includes(word) ||
          m.shortDescription?.includes(word) ||
          m.longDescription?.includes(word)
      );
    });

    setRelatedMovies(related);
  };

  useEffect(() => {
    if (movies && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn('Video playback was prevented:', err);
        }
      };
      playVideo();
    }
  }, [movies]);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movies?.trackName || 'Check out this movie!',
          text: 'Watch this amazing movie!',
          url: window.location.href,
        });
        alert('Content shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Your browser does not support sharing. Please copy the URL manually.');
    }
  };

  const handleDownload = () => {
    if (movies?.previewUrl) {
      const link = document.createElement('a');
      link.href = movies.previewUrl;
      link.download = `${movies.trackName || 'movie'}.mp4`;
      link.click();
    } else {
      alert('Download not available.');
    }
  };

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  if (!movies) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="flex flex-wrap">
      {/* Left Side - Sticky Content */}
      <div className="w-full lg:w-1/2">
        <div className="relative flex flex-col pt-20">
          <div
            className={`relative ${isFullScreen
              ? 'w-full h-screen'
              : 'md:w-full md:h-[60vh] w-full h-[30vh]'
              } transition-all duration-300`}
          >
            <video
              id="movie-video"
              className="w-full h-full object-cover"
              src={movies.previewUrl}
              controls
              ref={videoRef}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pt-6 p-3 text-center md:p-1 md:pt-4 bg-transparent space-x-10 md:w-[50vw]">
            <div className="flex justify-center text-center">
              {status === "authenticated" || userData !== null ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => { toggleAddToList(); toggleFavorite(movies) }}
                    className={`text-2xl md:text-3xl transition duration-300 ${added ? "text-green-500" : "text-white hover:text-green-400"
                      }`}
                  >
                    {added ? <FaCheck /> : <FaPlus />}
                  </button>
                  <h3 className="text-sm text-gray-400">
                    {added ? "Added to List" : "Add to List"}
                  </h3>
                </div>
              ) : (
                <Link href="/login">
                  <div className="flex flex-col items-center">
                    <button
                      className={`text-2xl md:text-3xl transition duration-300 ${added ? "text-green-500" : "text-white hover:text-green-400"
                        }`}
                    >
                      <FaPlus />
                    </button>
                    <h3 className="text-sm text-gray-400">
                      Add to List
                    </h3>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={toggleLike}
                className={`text-2xl md:text-3xl transition duration-300 ${liked ? "text-red-500" : "text-white"
                  }`}
              >
                <FaHeart />
              </button>
              <h3 className="text-sm text-gray-400">{liked ? "Liked" : "Like"}</h3>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={handleShare}
                className="text-white text-2xl md:text-3xl hover:text-blue-400 transition duration-300"
              >
                <FaShareAlt />
              </button>
              <h3 className="text-sm text-gray-400">Share</h3>
            </div>
            <div className="flex flex-col items-center">
              <button className="text-white text-2xl md:text-3xl hover:text-yellow-400 transition duration-300">
                <FaDownload />
              </button>
              <h3 className="text-sm text-gray-400">Download</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-4 md:py-20 overflow-y-auto max-h-screen">
        <div className="flex flex-col items-center">
          <h1 className='text-2xl font-bold text-gray-200 p-2 text-start'>Now</h1>
          {movies ? (
            <div className="main-movie bg-white shadow-lg rounded-md overflow-hidden w-full max-w-md">
              <div className="relative w-full h-64">
                <Image
                  src={movies.artworkUrl1000}
                  alt={movies.trackName}
                  fill
                  className="object-cover rounded-t-md"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{movies.trackName}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {movies.shortDescription}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{error || 'Loading movie...'}</p>
          )}

          {/* Related Movies */}
          <div className="related-movies mt-8 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Related Movies</h3>
            {relatedMovies.length > 0 ? (
              relatedMovies.map((movie) => (
                <Link href={`/movies/${movie.trackId}`} key={movie.trackId}>
                  <div
                    className="movie-item flex items-start bg-white shadow-md rounded-md overflow-hidden mb-4 relative group"
                  >
                    {/* Image */}
                    <div className="w-24 h-[104px] flex-shrink-0 relative">
                      <Image
                        src={movie.artworkUrl1000 || movie.artworkUrl500}
                        alt={movie.trackName}
                        layout="fill"
                        objectFit="fill"
                        className="rounded-md"
                      />
                    </div>

                    {/* Movie Details */}
                    <div className="p-4 flex-1 overflow-hidden">
                      <h4 className="text-lg font-medium text-gray-800 truncate">
                        {movie.trackName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {movie.shortDescription || movie.longDescription || 'No description available'}
                      </p>
                    </div>

                    {/* Hover Preview */}
                    {/* <div
                      className="md:block hidden absolute top-0 right-0 z-50 h-[104px] w-[26vw] text-white text-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {movie.previewUrl ? (
                        <span className="text-green-400">
                          <video
                            id="movie-video"
                            className="w-full h-full object-fill"
                            src={movies.previewUrl}
                            ref={videoRef}
                          />
                        </span>
                      ) : (
                        <p>No preview available</p>
                      )}
                    </div> */}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No related movies found.</p>
            )}
          </div>


        </div>
      </div>
    </div>
  );

}
