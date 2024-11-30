"use client";
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [Isloading, setIsLoading] = useState(true);
  const [Isemail, setIsEmail] = useState('');
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  Isloading
  console.log(`Id is ${id}`);


  useEffect(() => {
    console.log("status:", status);
    console.log("userData:", userData);
    console.log("Data:", session?.user?.email);

    const fetchCookieData = async () => {
      try {
        const response = await axios.get("/api/protected", {
          withCredentials: true,
        });
        setUserData(response.data.user);
        console.log(`response is ${response?.data?.user?.email}`);
        setIsEmail(response?.data?.user?.email)
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
  }, [status, userData, session, router]);

  useEffect(() => {
    const handleFetchMovies = async () => {
      setLoading(true);
      setError("");
      setMovies([]);

      const email = session?.user?.email || Isemail;

      if (!email) {
        setError("No email found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/favorite?email=${encodeURIComponent(email)}`);

        if (response.data && response.data.movies) {
          setMovies(response.data.movies);
        } else {
          setError("No movies found for this email.");
        }
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred while fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" || Isemail) {
      handleFetchMovies();
    }
  }, [session, Isemail, status, router]);

  const handleRemoveFavorite = async (movieId) => {
    try {
      const email = session?.user?.email || Isemail;
      if (!email) {
        alert("No email found. Please log in.");
        return;
      }

      const response = await axios.delete(`/api/favorite?email=${encodeURIComponent(email)}&movieId=${movieId}`);

      if (response.data && response.data.movies) {
        setMovies(response.data.movies); // Update the UI with the new list of favorites
      } else {
        setError("Failed to remove movie.");
      }
    } catch (error) {
      setError("Error removing movie. Please try again later.");
    }
  };
  useEffect(() => {
    if (movies.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [movies]);

  if (Isloading) {
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold pt-24 px-4">My List</h1>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.movieId || movie.movieName} className="flex flex-col">
              <div className="relative group rounded-lg overflow-hidden shadow-md bg-gray-800 hover:bg-gray-700 transition duration-300">
                <Link href={`/movies/${movie.movieId}`}>
                  {/* Movie Thumbnail */}
                  <Image
                    src={movie.thumbnail || '/placeholder-image.png'}
                    alt={movie.movieName}
                    width={200}
                    height={300}
                    className="object-fill w-full h-72 group-hover:scale-105 transition-transform duration-300"
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
                    <p className="truncate">{movie.movieName}</p>
                  </div>
                </Link>
              </div>

              {/* Remove Button */}
              <div className="mt-2">
                <button
                  onClick={() => handleRemoveFavorite(movie.movieId)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
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
    </div >
  );
}


