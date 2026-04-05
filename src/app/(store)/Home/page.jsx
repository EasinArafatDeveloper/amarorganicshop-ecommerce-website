import FeaturedCategories from "@/components/FeaturedCategories";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import TopSellingProducts from "@/components/TopSellingProducts";

export default function Home() {
    return (

        <div>
            <Navbar />
            <HeroSection />
            <FeaturedCategories />
            <TopSellingProducts />
        </div>
    );
}
