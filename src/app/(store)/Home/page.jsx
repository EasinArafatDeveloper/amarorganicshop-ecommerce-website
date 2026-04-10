import AllNaturalHoney from "@/components/AllNaturalHoney";
import AllProducts from "@/components/AllProducts";
import DualPosters from "@/components/DualPosters";
import FeaturedCategories from "@/components/FeaturedCategories";
import HeroSection from "@/components/HeroSection";
import Testimonials from "@/components/Testimonials";
import TopSellingProducts from "@/components/TopSellingProducts";
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Dynamic route

export default async function Home() {
    await connectMongo();
    
    // Attempt to fetch custom settings
    let settings = await StoreSettings.findOne({ singletonId: 'global' }).lean();
    
    // Default toggles if settings doc is missing
    const toggles = settings?.sectionToggles || {
        showHero: true,
        showCategories: true,
        showTopSelling: true,
        showHoney: true,
        showPromo: true,
        showAllProducts: true,
        showTestimonials: true
    };

    const titles = settings?.sectionTitles || {
        topSelling: 'Top Selling Products',
        honey: 'All Natural Honey',
        allProducts: 'All Products'
    };

    return (
        <div>
            {toggles.showHero && <HeroSection />}
            {toggles.showCategories && <FeaturedCategories />}
            {toggles.showTopSelling && <TopSellingProducts customTitle={titles.topSelling} />}
            {toggles.showHoney && <AllNaturalHoney customTitle={titles.honey} />}
            {toggles.showPromo && <DualPosters />}
            {toggles.showAllProducts && <AllProducts customTitle={titles.allProducts} />}
            {toggles.showTestimonials && <Testimonials />}
        </div>
    );
}
