"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "প্রতিদিনের পুষ্টি যোগাতে",
            highlight: "স্বাস্থ্যকর খেজুর",
            image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=1200",
            bgColor: "#1a0f0a"
        },
        {
            id: 2,
            title: "সেরা মানের প্রিমিয়াম",
            highlight: "খাঁটি মধু",
            image: "https://images.unsplash.com/photo-1589182337358-2cb63dfcd50d?auto=format&fit=crop&q=80&w=1200",
            bgColor: "#2a1b0a"
        },
        {
            id: 3,
            title: "রান্নার স্বাদ বাড়াতে",
            highlight: "খাঁটি ঘি",
            image: "https://images.unsplash.com/photo-1590540179852-2110a54f813a?auto=format&fit=crop&q=80&w=1200",
            bgColor: "#1a1a10"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Auto slide effect
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full bg-white py-4 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 h-[250px] sm:h-[350px] md:h-[420px]">

                {/* Left Main Slider (Takes 100% on Mobile, 70% on Desktop) */}
                <div className="relative w-full md:w-[70%] h-full rounded-xl overflow-hidden shadow-sm group">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('${slide.image}')`,
                                    backgroundColor: slide.bgColor
                                }}
                            >
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="relative h-full flex flex-col justify-center px-8 md:px-20">
                                <div className="mb-4">
                                    <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                                        {slide.title} <br />
                                        <span className="text-[#f39200]">{slide.highlight}</span>
                                    </h1>
                                </div>

                                {/* Product Layout Placeholder at Bottom */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end justify-center gap-2 w-full max-w-xs md:max-w-md pointer-events-none opacity-60 md:opacity-100">
                                    <div className="w-14 h-16 md:w-20 md:h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded shadow-2xl rotate-[-5deg]"></div>
                                    <div className="w-16 h-20 md:w-24 md:h-28 bg-white/20 backdrop-blur-sm border border-white/20 rounded shadow-2xl z-10 scale-110"></div>
                                    <div className="w-14 h-16 md:w-20 md:h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded shadow-2xl rotate-[5deg]"></div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded flex items-center justify-center shadow-lg hover:bg-white transition-colors z-30"
                    >
                        <ChevronLeft className="text-[#f39200]" size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded flex items-center justify-center shadow-lg hover:bg-white transition-colors z-30"
                    >
                        <ChevronRight className="text-[#f39200]" size={20} />
                    </button>

                    {/* Slider Dots */}
                    <div className="absolute bottom-6 left-8 md:left-10 flex gap-2 z-30">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-[#f39200] w-5 md:w-6' : 'bg-white/60'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Secondary Banner (HIDDEN ON MOBILE/SMALL DEVICES) */}
                <div className="hidden md:flex relative w-[30%] h-full rounded-xl overflow-hidden shadow-sm bg-[#f9f9f9] items-center group border border-gray-100">
                    {/* Decorative background circle */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#f39200]/5 rounded-full"></div>

                    <div className="relative flex w-full items-center px-6 gap-3">
                        {/* Product Mockup Container */}
                        <div className="w-[45%] h-48 bg-white rounded-lg shadow-md border border-gray-50 flex items-center justify-center p-2 z-10">
                            <div className="w-full h-full bg-[#f39200]/5 flex flex-col items-center justify-center border-2 border-dashed border-[#f39200]/20 rounded text-center">
                                <span className="text-[9px] font-bold text-[#1a2b3c] opacity-30">Ghee Pack</span>
                            </div>
                        </div>

                        {/* Promotional Text */}
                        <div className="w-[55%] z-10">
                            <h2 className="text-[#1a2b3c] text-lg lg:text-xl font-black leading-tight">
                                ১ কেজি স্বস্তি <br />
                                গাওয়া ঘি <br />
                                <span className="text-[#f39200]">১০০ টাকা</span> <br />
                                মূল্যছাড়!
                            </h2>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;