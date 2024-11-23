"use client"; // Add this line to ensure the component is rendered on the client side

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const logoutCookies = async () => {
    try {
      await axios.post("/api/logout");
      setUserData(null);
      toast.success("Logout successful!"); // Notify successful logout
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Logout failed. Please try again."); // Notify error on logout
    }
  };
  useEffect(() => {
    const fetchCookieData = async () => {
      try {
        const response = await axios.get("/api/protected", {
          withCredentials: true,
        });
        setUserData(response.data.user);
        // toast.success("User data fetched successfully!"); // Notify successful fetch
      } catch (error) {
        console.log("Failed to fetch protected data:", error);
        // toast.error("Failed to fetch user data. Please try again."); // Notify fetch error
      }
    };

    if (status === "unauthenticated" && !userData) {
      fetchCookieData();
    }
  }, [status, userData, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Detect scroll position to make the navbar transparent
  useEffect(() => {
    const handleScroll = () => {
      // Log scroll position for debugging
      console.log(window.scrollY); // Check the scroll position in the console
      if (window.scrollY > 10) {
        setScrolling(true); // Scroll down a little, set navbar to transparent
      } else {
        setScrolling(false); // At the top, make it fully opaque
      }
    };

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`flex justify-between items-center w-full fixed top-0 left-0 z-50 px-8 py-3 shadow-lg transition-all duration-300 ${isScrolled ? "bg-gray-900/30 fixed shadow-lg" : "bg-gray-900"
          } z-50`}
      >

        <div>
          <div className="flex items-center">
            <Link href="/">
              <span className="relative group text-white text-xl md:text-2xl font-semibold hover:animate-spin transition-colors duration-300 transform hover:scale-110">
                <span className="text-blue-500">&lt;</span>
                <span className="text-white group-hover:rotate-45 transition-transform duration-500">
                  Watch
                </span>
                <span className="text-blue-500 group-hover:text-blue-900 group-hover:rotate-45 transition-all duration-1000">
                  Movie/&gt;
                </span>
              </span>
            </Link>
          </div>
        </div>
        <div className="md:flex items-center gap-4">
          {status === "authenticated" || userData !== null ? (
            <>
              <p className="text-white">
                Welcome,{" "}
                {session?.user?.name ||
                  userData.username ||
                  session?.user?.email?.split(/(?=\d)/)[0]}
              </p>
              <button
                onClick={async () => {
                  await signOut();
                  await logoutCookies();
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"

              >
                Logout
              </button>
            </>
          ) : (
            <div className="gap-2 flex items-center justify-center">
              <Link
                href="/login"
                className="text-white hover:text-blue-500 transition-colors duration-300"
              >
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 md:px-4 px-3 rounded-lg transition-colors duration-300">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <ToastContainer />
    </>
  );
}
