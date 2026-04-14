"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider({ banners, fallbackImage, autoplayDuration = 5000 }) {
    // Prepare slides: use dynamic banners if they exist, otherwise fallback to the single banner
    const slides = banners && banners.length > 0 
        ? banners.map(b => ({ url: b.url, link: b.link || '/shop' }))
        : [{ url: fallbackImage, link: '/shop' }];

    // If there are no slides at all, don't render anything
    if (slides.length === 0) return null;

    return (
        <section className="w-full bg-white py-4 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="relative w-full aspect-[1600/749] rounded-2xl overflow-hidden bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100 group">
                    
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{ 
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100 transition-all duration-300',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !w-6 !rounded-full'
                        }}
                        autoplay={slides.length > 1 ? {
                            delay: autoplayDuration,
                            disableOnInteraction: false,
                        } : false}
                        effect="fade"
                        loop={slides.length > 1}
                        className="w-full h-full"
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <Link href={slide.link}>
                                    <div className="relative w-full h-full cursor-pointer">
                                        <Image
                                            src={slide.url}
                                            alt={`Banner ${index + 1}`}
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 768px) 100vw, 1400px"
                                            className="object-contain"
                                        />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}

                        {/* Custom Navigation Arrows */}
                        {slides.length > 1 && (
                            <>
                                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 border border-gray-100 text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg translate-x-[-10px] group-hover:translate-x-0 cursor-pointer hover:scale-110 active:scale-95">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                </button>
                                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 border border-gray-100 text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg translate-x-[10px] group-hover:translate-x-0 cursor-pointer hover:scale-110 active:scale-95">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </button>
                            </>
                        )}
                    </Swiper>

                    {/* Styling custom dots via inline CSS to ensure specificity */}
                    <style jsx global>{`
                        .swiper-pagination {
                            bottom: 20px !important;
                        }
                        .swiper-pagination-bullet {
                            height: 6px !important;
                            width: 6px !important;
                            margin: 0 4px !important;
                        }
                        .swiper-pagination-bullet-active {
                            width: 20px !important;
                        }
                    `}</style>
                </div>
            </div>
        </section>
    );
}
