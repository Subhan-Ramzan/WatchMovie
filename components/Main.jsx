import React from 'react';
import Link from 'next/link';
import HomeMovie from './HomeMovie';
export default function Main() {
    return (
        <main className="pt-24 px-6 bg-slate-950 text-white min-h-screen">
            <div className="max-w-7xl mx-auto text-center py-16">
                <h1 className="text-5xl font-bold mb-6 leading-tight">Unlimited Movies, TV Shows, and More</h1>
                <p className="text-xl pb-8 text-gray-300">Some movies are available for free. If you want to watch in 4K, you can get a membership starting at Rs 250.</p>

                <h3 className="text-2xl font-medium pb-6">
                    Ready to watch? Enter your email to create or restart your membership.
                </h3>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-12">
                    <input
                        type="email"
                        className="p-4 rounded-lg border border-gray-300 text-black w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder="Email address"
                    />
                    <Link
                        href="/login"
                        className="block w-full sm:w-auto"
                    >
                        <button className="bg-gradient-to-bl from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-8 rounded-lg hover:bg-red-700 transition-all duration-300 w-full">
                            Get Started &gt;
                        </button>
                    </Link>

                </div>
            </div>
            <HomeMovie />
            <section className="py-16">
                <h3 className="text-3xl font-semibold text-center pb-12">A Plan To Suit Your Needs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA HD'].map((plan, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-red-600">{plan}</h2>
                            <p className="text-lg pb-4 text-gray-300">
                                {plan === 'PREMIUM' ? 'A cinematic experience with the best picture and audio quality.' :
                                    'Stream your favorite content with this plan.'}
                            </p>
                            <h3 className="text-xl font-semibold">
                                {plan === 'BASIC' ? 'Rs 250/month' : plan === 'STANDARD' ? 'Rs 500/month' : 'Rs 1,100/month'}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-16">
                <h3 className="text-3xl font-semibold text-center pb-12">More Reasons to Join</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Enjoy on your TV', desc: 'Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.' },
                        { title: 'Stream Anywhere', desc: 'Enjoy on your phone, tablet, laptop, and TV without any extra fees.' },
                        { title: 'Download and Watch', desc: 'Download shows and movies to watch offline on your devices.' },
                        { title: 'Cancel Anytime', desc: 'No commitments. Cancel your subscription at any time.' },
                    ].map((feature, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                            <h2 className="text-2xl font-bold pb-4 text-red-600">{feature.title}</h2>
                            <p className="text-lg pb-4 text-gray-300">{feature.desc}</p>
                            <div className="text-red-600">
                                {/* Replace this with a proper icon */}
                                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mx-auto">
                                    <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <hr className='md:block hidden' />
        </main>
    );
}
