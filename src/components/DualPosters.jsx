"use client";
import React from 'react';
import Link from 'next/link';

const DualPosters = ({ settings }) => {
    // Fallback images if nothing is configured
    const defaultImageOne = "https://backoffice.ghorerbazar.com/banner/Tyz131763632384.png";
    const defaultImageTwo = "https://admin.ghorerbazarbd.com/storage/banners/1709121683.jpg";

    const posterOneImage = settings?.dualPosterOneImage || defaultImageOne;
    const posterOneLink = settings?.dualPosterOneLink || "/";
    
    const posterTwoImage = settings?.dualPosterTwoImage || defaultImageTwo;
    const posterTwoLink = settings?.dualPosterTwoLink || "/";

    return (
        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Poster One */}
                <Link href={posterOneLink} className="relative group overflow-hidden rounded-2xl block transition-all duration-500 hover:shadow-2xl shadow-md border border-gray-100 bg-white">
                    <div className="aspect-[21/10] md:aspect-[16/8] w-full overflow-hidden flex items-center justify-center bg-gray-100">
                        <img
                            src={posterOneImage}
                            alt="Promotion Banner 1"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Link>

                {/* Poster Two */}
                <Link href={posterTwoLink} className="relative group overflow-hidden rounded-2xl block transition-all duration-500 hover:shadow-2xl shadow-md border border-gray-100 bg-white">
                    <div className="aspect-[21/10] md:aspect-[16/8] w-full overflow-hidden flex items-center justify-center bg-gray-100">
                        <img
                            src={posterTwoImage}
                            alt="Promotion Banner 2"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Link>

            </div>
        </div>
    );
};

export default DualPosters;