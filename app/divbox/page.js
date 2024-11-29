// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Link from 'next/link';

// // const colors = [
// //   'bg-red-500',
// //   'bg-blue-500',
// //   'bg-green-500',
// //   'bg-yellow-500',
// //   'bg-purple-500',
// //   'bg-pink-500',
// //   'bg-orange-500',
// //   'bg-teal-500',
// //   'bg-indigo-500',
// //   'bg-gray-500'
// // ];

// // export default function Home() {
// //   const [favorites, setFavorites] = useState([]);

// //   // Load favorites from localStorage initially
// //   useEffect(() => {
// //     const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
// //     setFavorites(storedFavorites);
// //   }, []);

// //   const toggleFavorite = (color) => {
// //     const updatedFavorites = favorites.includes(color)
// //       ? favorites.filter((fav) => fav !== color)
// //       : [...favorites, color];

// //     setFavorites(updatedFavorites);
// //     localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update localStorage
// //   };

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-3xl font-bold mb-4">Select Your Favorite Boxes</h1>
// //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
// //         {colors.map((color, index) => (
// //           <div
// //             key={index}
// //             className={`w-20 h-20 rounded-lg ${color} cursor-pointer`}
// //             onClick={() => toggleFavorite(color)}
// //           >
// //             <div className="w-full h-full flex items-center justify-center text-white font-semibold">
// //               {favorites.includes(color) ? '★' : '☆'}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //       <Link href="/favorites">
// //         <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
// //           Go to Favorites ({favorites.length})
// //         </button>
// //       </Link>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import axios from "axios";

// const colors = [
//   "bg-red-500",
//   "bg-blue-500",
//   "bg-green-500",
//   "bg-yellow-500",
//   "bg-purple-500",
//   "bg-pink-500",
//   "bg-orange-500",
//   "bg-teal-500",
//   "bg-indigo-500",
//   "bg-gray-500",
// ];

// export default function Home() {
//   const { data: session } = useSession();
//   const [favorites, setFavorites] = useState([]);

//   const toggleFavorite = (color) => {
//     setFavorites((prevFavorites) =>
//       prevFavorites.includes(color)
//         ? prevFavorites.filter((fav) => fav !== color)
//         : [...prevFavorites, color]
//     );
//   };

//   const saveFavorites = async () => {
//     if (!session) {
//       alert("You must be logged in to save favorites.");
//       return;
//     }

//     try {
//       const response = await axios.post("/api/favorite", {
//         colors: favorites,
//       });
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Failed to save favorites:", error);
//       alert("Error saving favorites.");
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-4">Select Your Favorite Boxes</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {colors.map((color, index) => (
//           <div
//             key={index}
//             className={`w-20 h-20 rounded-lg ${color} cursor-pointer`}
//             onClick={() => toggleFavorite(color)}
//           >
//             <div className="w-full h-full flex items-center justify-center text-white font-semibold">
//               {favorites.includes(color) ? "★" : "☆"}
//             </div>
//           </div>
//         ))}
//       </div>
//       <button
//         onClick={saveFavorites}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//       >
//         Save Favorites
//       </button>
//       <Link href="/favorites">
//         <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//           Go to Favorites
//         </button>
//       </Link>
//     </div>
//   );
// }

"use client"
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    movieId: "",
    movieName: "",
    thumbnail: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsError(false);

    try {
      const response = await axios.post("/api/favorite", formData);

      setMessage(response.data.message);
    } catch (error) {
      setIsError(true);

      if (error.response && error.response.data) {
        setMessage(error.response.data.error || "Something went wrong!");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Add Movie to Favorites
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div> */}

          <div>
            <label
              htmlFor="movieId"
              className="block text-gray-700 font-medium mb-1"
            >
              Movie ID
            </label>
            <input
              type="text"
              id="movieId"
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="movieName"
              className="block text-gray-700 font-medium mb-1"
            >
              Movie Name
            </label>
            <input
              type="text"
              id="movieName"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="thumbnail"
              className="block text-gray-700 font-medium mb-1"
            >
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700"
          >
            Save to Favorites
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
