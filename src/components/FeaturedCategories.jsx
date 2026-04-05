"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedCategories = () => {
    const scrollRef = useRef(null);

    const categories = [
        { id: 1, name: "Organic", image: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png" },
        { id: 2, name: "Honey", image: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png" },
        { id: 3, name: "Dates", image: "https://cdn-icons-png.flaticon.com/512/7627/7627609.png" },
        { id: 4, name: "Spices", image: "https://cdn-icons-png.flaticon.com/512/2153/2153833.png" },
        { id: 5, name: "Nuts & Seeds", image: "https://cdn-icons-png.flaticon.com/512/2553/2553702.png" },
        { id: 6, name: "Beverage", image: "https://cdn-icons-png.flaticon.com/512/3082/3082006.png" },
        { id: 7, name: "Rice", image: "https://cdn-icons-png.flaticon.com/512/2636/2636737.png" },
        { id: 8, name: "Flours & Lentils", image: "https://cdn-icons-png.flaticon.com/512/6122/6122415.png" },
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full bg-white py-12 px-4 md:px-12">
            <div className="max-w-[1400px] mx-auto relative">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="text-[#1a2b3c] text-2xl md:text-2xl font-medium">
                        Featured Categories
                    </h2>
                </div>

                {/* Category Container */}
                <div className="relative flex items-center">
                    {/* Left Navigation Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-2 md:-left-5 z-20 w-10 h-10 bg-[#f39200] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#e08600] transition-all active:scale-95"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>

                    {/* Categories Scroll Area */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar pb-4 px-2 snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex flex-col items-center flex-shrink-0 w-[140px] md:w-[160px] snap-start"
                            >
                                {/* Image Card Area - Rounded Light Gray Box */}
                                <div className="w-full aspect-square bg-[#f5f5f5] rounded-[2.5rem] flex items-center justify-center p-6 md:p-8 hover:bg-[#efefef] transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Category Label */}
                                <span className="mt-4 text-[#1a2b3c] font-normal text-sm md:text-[15px] text-center">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right Navigation Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-2 md:-right-5 z-20 w-10 h-10 bg-[#f39200] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#e08600] transition-all active:scale-95"
                    >
                        <ChevronRight size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
        </section>
    );
};

export default FeaturedCategories;