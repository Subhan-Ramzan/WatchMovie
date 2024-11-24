'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSearch}
                className="flex items-center w-[90%] max-w-2xl bg-white rounded-full shadow-lg overflow-hidden"
            >
                <input
                    type="search"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 text-gray-800 placeholder-gray-400 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Search movies"
                />
                <button
                    type="submit"
                    className="bg-blue-600 p-3 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                    aria-label="Search"
                >
                    <FaSearch className="text-base sm:text-lg" />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
