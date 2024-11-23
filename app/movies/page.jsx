"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Define ProgressiveImageCard component
const ProgressiveImageCard = ({ movie }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white transition-all hover:scale-105 hover:shadow-xl">
            {/* Movie Card */}
            <Link href={`/movies/${movie.trackId}`}>
                <div className="relative w-full h-48 sm:h-52">
                    {/* Placeholder image shown until high-res image loads */}
                    <Image
                        src={movie.artworkUrl30} // Placeholder image
                        alt={movie.trackName}
                        layout="fill"
                        objectFit="fit"
                        className={`transition-opacity duration-300 ${imageLoaded ? "opacity-0" : "opacity-100"}`}
                    />
                    {/* High-res image, hidden until fully loaded */}
                    <Image
                        src={movie.artworkUrl1000 || movie.artworkUrl500} // High-res image
                        alt={movie.trackName}
                        layout="fill"
                        objectFit="fit"
                        className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{movie.trackName}</h2>
                </div>
            </Link>
        </div>
    );
};

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch movies using axios
        const fetchMovies = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axios.get('/api/movie');

                if (response.data && response.data.results) {
                    setMovies(response.data.results);
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

    if (error) {
        return <div className="text-red-500 text-center text-xl">{error}</div>;
    }

    if (!movies.length) {
        return <div className="text-4xl text-black text-center py-8">Loading...</div>;
    }

    return (
        <div className="px-4 py-8 max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Movies</h1>
            {/* Movie Grid Component */}
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                    <ProgressiveImageCard key={movie.trackId} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;

