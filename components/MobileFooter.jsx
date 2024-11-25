"use client"
import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { FaList } from "react-icons/fa"; // Import the list icon
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { FaRegCircleUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import axios from "axios";

const MobileFooter = () => {
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
        <>
            <div className="md:hidden bg-gray-900 sticky bottom-0 p-2 items-center justify-center">
                <div className="flex items-center space-x-4 justify-around">
                    {/* Home Icon */}
                    <div className="relative flex items-center">
                        <Link href="/">
                            <IoMdHome className="text-3xl cursor-pointer text-white" />
                        </Link>
                    </div>

                    {/* Playlist Icon */}
                    <Link href="/playlist" className="text-xl md:text-2xl relative">
                        <FaList className="text-2xl text-white" />
                    </Link>

                    {/* Profile Icon */}
                    <div className="md:hidden">
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
                                <FaRegCircleUser className="text-3xl text-white md:text-3xl cursor-pointer" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <hr className="md:hidden block" />
        </>
    );
};

export default MobileFooter;
