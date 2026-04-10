"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
    const image =
        "https://i.postimg.cc/mDhYGZ1r/amar-organic-shop-cover-image.png";

    return (
        <section className="w-full bg-white py-4 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Clickable Image */}
                <Link href="/shop">
                    <div className="relative w-full aspect-[1600/749] rounded-2xl overflow-hidden bg-white cursor-pointer">

                        <Image
                            src={image}
                            alt="Amar Organic Shop Cover"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1400px"
                            className="object-contain"
                        />

                    </div>
                </Link>

            </div>
        </section>
    );
};

export default HeroSection;