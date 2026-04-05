"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Drag to scroll state variables
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const reviews = [
        {
            id: 1,
            name: "Fariha Akter Tumpa",
            role: "Entrepreneur",
            image: "https://randomuser.me/api/portraits/women/32.jpg",
            comment: "এই অবিশ্বাসের জগতে আস্থাশীল একটি প্রতিষ্ঠান ঘরের বাজার।",
        },
        {
            id: 2,
            name: "Shahriar Khan Abir",
            role: "Service Holder",
            image: "https://randomuser.me/api/portraits/men/44.jpg",
            comment: "I don't like ghee, but my father really loves it. So I bought some ghee for him. He said this ghee is the best he has ever had",
        },
        {
            id: 3,
            name: "Ahmod Al Kamran",
            role: "Student",
            image: "https://randomuser.me/api/portraits/men/45.jpg",
            comment: "আমি একজন ঘরের বাজারের নিয়মিত কাস্টমার। আমি শুধু ঘরের বাজার থেকে এই যে প্রোডাক্ট আনি এমন নয়। আমি অনেক জায়গা থেকে এই প্রোডাক্ট এনেছি। তবে আমার মতে এসব পেজ থেকে ঘরের বাজার সেরা।",
        },
        {
            id: 4,
            name: "Sultana Razia",
            role: "Housewife",
            image: "https://randomuser.me/api/portraits/women/65.jpg",
            comment: "Sundarban-er modhu ta khub-i bhalo chilo. Delivery-o khub druto peyechi. Packaging quality chilo proshongshoniyo.",
        }
    ];

    // Logic for Mouse Drag (Swipe)
    const handleMouseDown = (e) => {
        setIsDown(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / (clientWidth / (window.innerWidth < 768 ? 1 : 3)));
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
        <section className="w-full bg-white py-12 md:py-20 px-4 select-none">
            <style>
                {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .cursor-grab { cursor: grab; }
          .cursor-grabbing { cursor: grabbing; }
        `}
            </style>

            <div className="max-w-[1400px] mx-auto">

                <div className="relative">
                    <div
                        ref={scrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={`flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x md:snap-none snap-mandatory pb-10 ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
                    >
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="min-w-full md:min-w-[calc(33.333%-16px)] bg-white rounded-xl p-8 border border-gray-200 shadow-sm snap-start flex flex-col min-h-[220px] pointer-events-none md:pointer-events-auto"
                            >
                                <div className="flex-grow">
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
                                        {review.comment}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[#1a2b3c] font-bold text-[15px] leading-tight">
                                            {review.name}
                                        </h4>
                                        <span className="text-gray-400 text-[13px] mt-1 italic">
                                            {review.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-4">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                className={`transition-all duration-300 rounded-full border-2 border-[#f39200] ${activeIndex === i
                                        ? "w-3.5 h-3.5 bg-[#f39200]"
                                        : "w-3.5 h-3.5 bg-transparent"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => {
                                    const cardWidth = scrollRef.current.scrollWidth / reviews.length;
                                    scrollRef.current.scrollTo({
                                        left: cardWidth * i,
                                        behavior: 'smooth'
                                    });
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;