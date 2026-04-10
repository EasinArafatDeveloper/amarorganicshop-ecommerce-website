import Image from "next/image";
import Link from "next/link";
import React from "react";
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export default async function HeroSection() {
    await connectMongo();
    
    // Attempt to fetch custom settings
    const settings = await StoreSettings.findOne({ singletonId: 'global' }).lean();
    
    // Fallback if settings don't exist yet
    const image = settings?.heroBannerUrl || "https://i.postimg.cc/mDhYGZ1r/amar-organic-shop-cover-image.png";

    return (
        <section className="w-full bg-white py-4 px-4 md:px-8">
            <h1 className="sr-only">Amar Organic Shop - Best Authentic Organic Foods in Bangladesh</h1>
            <div className="max-w-[1400px] mx-auto">

                {/* Clickable Dynamic Image */}
                <Link href="/shop">
                    <div className="relative w-full aspect-[1600/749] rounded-2xl overflow-hidden bg-white cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group">

                        <Image
                            src={image}
                            alt="Amar Organic Shop Cover"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1400px"
                            className="object-contain transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                        />

                    </div>
                </Link>

            </div>
        </section>
    );
}