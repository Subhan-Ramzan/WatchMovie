"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FiDownload, FiArrowRight, FiList, FiSettings } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
export default function Page() {

    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [publicId, setPublicId] = useState(null);
    const router = useRouter();

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

    return (
        <div className="pt-24 flex flex-col px-4 space-y-8">
            <div className="flex justify-center text-center">
                {status === "authenticated" || userData !== null ? (
                    <Link href="/profile" className="items-center text-center justify-center flex flex-col">
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image.url || session.user.image}
                                alt="User Profile"
                                width={70}
                                height={70}
                                className="rounded-full object-cover cursor-pointer" />
                        ) : publicId ? (
                            <CldImage
                                src={publicId}
                                alt="User Profile"
                                width={70}
                                height={70}
                                className="rounded-full object-cover cursor-pointer" />
                        ) : (
                            <FaRegCircleUser className="text-5xl cursor-pointer" />
                        )}
                        <p className="text-white">
                            {session?.user?.name || userData?.username || "User"}
                        </p>
                        <p className="text-gray-600">{session?.user?.email || userData.email || "User"}</p>

                    </Link>
                ) : (
                    <Link href="/login">
                        <FaRegCircleUser className="text-5xl text-white md:text-8xl cursor-pointer" />
                    </Link>
                )}
            </div>

            {/* Downloads Section */}
            <div className="flex justify-between items-center text-gray-100">
                <Link href={'/download'} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500 hover:bg-red-700 p-2 rounded-full">
                            <FiDownload size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-100">Downloads</h1>
                    </div>
                    <FiArrowRight size={24} className="text-gray-400" />
                </Link>
            </div>

            {/* My List Section */}
            <div className="flex justify-between items-center text-gray-100">
                <Link href={'/playlist'} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500 p-2 rounded-full">
                            <FiList size={24} className="text-white font-extrabold" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-100">My List</h1>
                    </div>
                    <FiArrowRight size={24} className="text-gray-400" />
                </Link>
            </div>

            {/* Settings Section */}
            <div className="flex justify-between items-center text-gray-100">
                <Link href={'/setting'} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-600 p-2 rounded-full">
                            <FiSettings size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
                    </div>
                    <FiArrowRight size={24} className="text-gray-400" />
                </Link>
            </div>
        </div >
    );
}
