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

    const sectionOrder = settings?.sectionOrder || [
        'showHero', 'showCategories', 'showTopSelling', 'showHoney', 'showPromo', 'showAllProducts', 'showTestimonials'
    ];

    const renderSection = (id) => {
        if (!toggles[id]) return null;
        
        switch (id) {
            case 'showHero': 
                return <HeroSection key={id} />;
            case 'showCategories': 
                return <FeaturedCategories key={id} />;
            case 'showTopSelling': 
                return <TopSellingProducts key={id} customTitle={titles.topSelling} />;
            case 'showHoney': 
                return <AllNaturalHoney key={id} customTitle={titles.honey} />;
            case 'showPromo': 
                return <DualPosters key={id} settings={settings} />;
            case 'showAllProducts': 
                return <AllProducts key={id} customTitle={titles.allProducts} />;
            case 'showTestimonials': 
                return <Testimonials key={id} />;
            default: 
                return null;
        }
    };

    return (
        <div>
            {sectionOrder.map(id => renderSection(id))}
        </div>
    );
}
