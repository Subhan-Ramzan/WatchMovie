"use client"; // Add this line to ensure the component is rendered on the client side

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { CldImage } from "next-cloudinary";
import { FaRegCircleUser } from "react-icons/fa6";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const router = useRouter();

  const logoutCookies = async () => {
    try {
      await axios.post("/api/logout");
      setUserData(null);
      toast.success("Logout successful!");
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Logout failed. Please try again.");
    }
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {

      console.log(window.scrollY);
      if (window.scrollY > 10) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`flex justify-between items-center w-full fixed top-0 left-0 z-50 px-6 sm:px-8 py-4 shadow-lg transition-all duration-300 ${isScrolled ? "bg-gray-900/80 shadow-lg" : "bg-gray-900"
        }`}>
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="relative group text-white text-xl md:text-xl font-semibold transition-transform hover:scale-110">
            <span className="text-blue-500">&lt;</span>
            <span className="text-white group-hover:rotate-45 transition-transform duration-500">
              Watch
            </span>
            <span className="text-blue-500 group-hover:text-blue-900 group-hover:rotate-45 transition-all duration-1000">
              Movie/&gt;
            </span>
          </span>
        </Link>
        {/* Navbar Links */}
        <nav className="hidden lg:flex items-center gap-6 text-white text-sm sm:text-base">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link href="/movies" className="hover:text-blue-500 transition-colors">
            Movies
          </Link>
          <Link href="/movies" className="hover:text-blue-500 transition-colors">
            TV Shows
          </Link>
          <Link href="/playlist" className="hover:text-blue-500 transition-colors">
            PlayList
          </Link>
        </nav>
      </div>

      {/* Search, Notifications, and User Account */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative hidden sm:flex">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white hover:text-blue-500">
            <FaSearch />
          </button>
        </div>

        {/* Profile */}
        <div className="md:block hidden">
          {status === "authenticated" || userData !== null ? (
            <Link href="/profile">
              {session?.user?.image ? (
                <Image
                  src={session.user.image.url || session.user.image}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover cursor-pointer" />
              ) : publicId ? (
                <CldImage
                  src={publicId}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover cursor-pointer" />
              ) : (
                <Link href="/login">
                  <FaRegCircleUser className="text-3xl cursor-pointer" />
                </Link>
              )}
            </Link>
          ) : (
            <Link href="/login">
              <FaRegCircleUser className="text-2xl text-white md:text-3xl cursor-pointer" />
            </Link>
          )}
        </div>

        {/* User Profile */}
        {status === "authenticated" || userData ? (
          <div className="flex items-center justify-center gap-2">
            <p className="text-white hidden md:block">
              Hi, {session?.user?.name || userData.username || "User"}
            </p>
            <button
              onClick={async () => {
                await signOut();
                await logoutCookies();
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 items-center justify-center">
            <Link href="/login" className="text-white hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup">
              <button className="bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
