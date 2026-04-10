import AllNaturalHoney from "@/components/AllNaturalHoney";
import AllProducts from "@/components/AllProducts";
import DualPosters from "@/components/DualPosters";
import FeaturedCategories from "@/components/FeaturedCategories";
import HeroSection from "@/components/HeroSection";
import Testimonials from "@/components/Testimonials";
import TopSellingProducts from "@/components/TopSellingProducts";

export default function Home() {
    return (

        <div>
            <HeroSection />
            <FeaturedCategories />
            <TopSellingProducts />
            <AllNaturalHoney />
            <DualPosters />
            <AllProducts />
            <Testimonials />
        </div>
    );
}
