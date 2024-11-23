"use client";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="pt-4 py-6 px-8 text-white bg-slate-950 max-h-screen">
            <div className="space-y-6">
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-gray-300 hover:text-white"
                    >
                        Questions? Contact us.
                    </Link>
                </div>

                <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                    <li>
                        <Link href="/login" className="hover:text-white">
                            FAQ
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Help Center
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Account
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Media Center
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Investor Relations
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Jobs
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Ways to Watch
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Terms of Use
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Privacy
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Cookie Preferences
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Corporate Information
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Speed Test
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Legal Notices
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="hover:text-white">
                            Only on Netflix
                        </Link>
                    </li>
                </ul>

                <div className="text-center">
                    <select
                        name="language"
                        id="language"
                        className="bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4"
                    >
                        <option value="english">English</option>
                        <option value="urdu">Urdu</option>
                    </select>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
