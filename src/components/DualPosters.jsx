"use client";
import React from 'react';

const DualPosters = () => {
    const posters = [
        {
            id: 1,
            image: "https://backoffice.ghorerbazar.com/banner/Tyz131763632384.png",
            alt: "Dates Banner"
        },
        {
            id: 2,
            image: "https://admin.ghorerbazarbd.com/storage/banners/1709121683.jpg",
            alt: "Ghee Banner"
        }
    ];

    return (
        <div className="w-full bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {posters.map((poster) => (
                    <div
                        key={poster.id}
                        className="relative group overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl shadow-md border border-gray-100"
                    >
                        {/* Fixed Aspect Ratio Box: 
                'aspect-[21/9]' walla 'aspect-[16/9]' ina gollora no haanirta nii 
                ngam poster o fof heewde box o.
            */}
                        <div className="aspect-[21/10] md:aspect-[16/8] w-full overflow-hidden">
                            <img
                                src={poster.image}
                                alt={poster.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x400?text=Banner+Image';
                                }}
                            />
                        </div>

                        {/* Hover Overlay ngam mawninde mbaydi o seeɗa */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DualPosters;