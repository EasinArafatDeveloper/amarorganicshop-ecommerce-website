import React from "react";
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';
import HeroSlider from "./HeroSlider";

export const dynamic = 'force-dynamic';

export default async function HeroSection() {
    await connectMongo();
    
    // Attempt to fetch custom settings
    const settings = await StoreSettings.findOne({ singletonId: 'global' }).lean();
    
    const fallbackImage = settings?.heroBannerUrl || "https://i.postimg.cc/mDhYGZ1r/amar-organic-shop-cover-image.png";
    const banners = settings?.heroBanners || [];
    const autoplayDuration = settings?.heroSliderAutoplay || 5000;

    return (
        <>
            <h1 className="sr-only">Amar Organic Shop - Best Authentic Organic Foods in Bangladesh</h1>
            <HeroSlider banners={banners} fallbackImage={fallbackImage} autoplayDuration={autoplayDuration} />
        </>
    );
}