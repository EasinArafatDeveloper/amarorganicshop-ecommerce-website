"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const AllNaturalHoney = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Dragging state variables
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const products = [
        {
            id: 1,
            name: "Black Seed Honey 1kg",
            currentPrice: 1440,
            oldPrice: 1600,
            savePercent: 10,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Offered Items"
        },
        {
            id: 2,
            name: "Crystal Honey 1kg",
            currentPrice: 1000,
            oldPrice: 1100,
            savePercent: 9,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: null
        },
        {
            id: 3,
            name: "Lichu Flower Honey 1kg",
            currentPrice: 1000,
            oldPrice: 1200,
            savePercent: 17,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: null
        },
        {
            id: 4,
            name: "African Organic Wild Honey 1kg",
            currentPrice: 2200,
            oldPrice: 2500,
            savePercent: 12,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: null
        },
        {
            id: 5,
            name: "Sundarban Honey 1kg",
            currentPrice: 2200,
            oldPrice: 2500,
            savePercent: 12,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Offered Items"
        },
        {
            id: 6,
            name: "Wild Flower Honey 1kg",
            currentPrice: 1200,
            oldPrice: 1500,
            savePercent: 20,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Best Seller"
        }
    ];

    // Mouse Down handler (Dragging start)
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    // Mouse Move handler (Dragging)
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed logic
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Mouse Up handler (Dragging end)
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Dynamic Scroll Handler ngam Pagination Dots
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // Mbaydi hisaabu ngam heɓde index dot on
            // Sibu eden jogii 6 items, so 4 ina njiya e desktop, pagination index wonata 2 walla 3
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) {
                setActiveIndex(0);
                return;
            }

            const percentage = scrollLeft / maxScroll;
            const totalDots = products.length;
            const index = Math.round(percentage * (totalDots - 1));

            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <section className="w-full bg-white py-12 px-4 md:px-8 overflow-hidden">
            <style>
                {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-select {
            user-select: none;
            -webkit-user-drag: none;
          }
        `}
            </style>

            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-end border-b-2 border-gray-100 mb-8 pb-2 relative">
                    <div className="relative">
                        <h2 className="text-[#1a2b3c] text-xl md:text-2xl font-bold">
                            All Natural Honey
                        </h2>
                        <div className="absolute bottom-[-10px] left-0 w-full h-[3px] bg-[#f39200]"></div>
                    </div>
                    <button className="flex items-center gap-1 text-[#f39200] font-bold text-xs md:text-sm hover:underline uppercase tracking-wider transition-all">
                        View All Items <ArrowRight size={16} />
                    </button>
                </div>

                {/* Swiper Container */}
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-1 ${isDragging ? 'cursor-grabbing active:snap-none' : 'cursor-grab'}`}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[260px] md:min-w-[300px] lg:min-w-[calc(25%-1.25rem)] bg-white border border-gray-100 rounded-xl p-5 flex flex-col snap-start transition-all duration-300 hover:shadow-xl hover:border-[#f39200]/20 group no-select"
                        >
                            {/* Badges */}
                            <div className="flex justify-between items-start h-8 mb-4 pointer-events-none">
                                {product.badge ? (
                                    <span className="bg-[#f39200] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                                        {product.badge}
                                    </span>
                                ) : <div />}
                                <span className="bg-[#4caf50] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                                    Save {product.savePercent}%
                                </span>
                            </div>

                            {/* Product Image */}
                            <div className="h-56 flex items-center justify-center mb-6 overflow-hidden pointer-events-none">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col flex-grow pointer-events-none">
                                <h3 className="text-gray-800 text-sm md:text-base font-bold mb-3 line-clamp-2 min-h-[44px] group-hover:text-[#f39200] transition-colors">
                                    {product.name}
                                </h3>

                                {/* Pricing */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[#f39200] text-xl font-black">৳{product.currentPrice.toLocaleString()}</span>
                                    {product.oldPrice && (
                                        <span className="text-gray-400 line-through text-sm font-medium">৳{product.oldPrice.toLocaleString()}</span>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Logique ngam add to cart
                                    }}
                                    className="w-full border-2 border-[#f39200] text-[#f39200] py-2.5 rounded-lg flex items-center justify-center gap-2 font-black text-sm transition-all duration-300 hover:bg-[#f39200] hover:text-white shadow-sm hover:shadow-orange-200 pointer-events-auto"
                                >
                                    <ShoppingCart size={20} strokeWidth={2.5} />
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dynamic Pagination Dots */}
                <div className="flex justify-center items-center gap-2 mt-10">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (scrollRef.current) {
                                    const { scrollWidth, clientWidth } = scrollRef.current;
                                    const maxScroll = scrollWidth - clientWidth;
                                    const scrollAmount = (i / (products.length - 1)) * maxScroll;
                                    scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                                }
                            }}
                            className={`transition-all duration-300 rounded-full ${activeIndex === i
                                    ? "w-4 h-4 bg-[#f39200] shadow-md scale-110" // Color e mawnugol ngam dot active
                                    : "w-2.5 h-2.5 border-2 border-[#f39200] bg-transparent opacity-40 hover:opacity-100" // Dot inactive
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllNaturalHoney;