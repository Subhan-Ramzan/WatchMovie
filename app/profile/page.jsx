import React from 'react';
import Link from 'next/link';

const Page = () => {
    return (
        <div className="flex justify-center items-center h-screen text-white">
            <div className="text-center transform perspective-1000 hover:transform-none transition-transform duration-700 ease-in-out">

                <h1 className="text-5xl font-extrabold mb-6 text-white animate-fadeInUp">
                    I will Create This Page Soon
                </h1>

                <p className="text-lg mb-6 opacity-0 animate-slideUp text-gray-300">Stay tuned for more updates!</p>
                <Link href={'/movies'}>
                    <button className="px-6 py-3 mt-6 text-xl font-semibold bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
                        Coming Soon!
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Page;
