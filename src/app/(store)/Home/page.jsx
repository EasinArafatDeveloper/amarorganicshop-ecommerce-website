import AllNaturalHoney from "@/components/AllNaturalHoney";
import AllProducts from "@/components/AllProducts";
import DualPosters from "@/components/DualPosters";
import FeaturedCategories from "@/components/FeaturedCategories";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import TopSellingProducts from "@/components/TopSellingProducts";

export default function Home() {
    return (

        <div>
            <Navbar />
            <HeroSection />
            <FeaturedCategories />
            <TopSellingProducts />
            <AllNaturalHoney />
            <DualPosters />
            <AllProducts />
            <Testimonials />
            <Footer />
        </div>
    );
}
