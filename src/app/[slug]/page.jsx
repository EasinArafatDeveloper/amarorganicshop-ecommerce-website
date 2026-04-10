'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { getProductsByCategory } from '@/lib/data/productsData';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

const CategoryPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug;
    const subSlug = searchParams.get('sub');
    const { addToCart } = useCart();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let filteredProducts = [];
        
        // Fetch all products in the category using the slug
        const allCatProducts = getProductsByCategory(slug);
        
        // If subcategory is selected in query string (e.g. ?sub=sundarban-honey)
        if (subSlug && allCatProducts) {
             // Try to filter by sub-slug (matching product slug or subCategory name if possible)
             filteredProducts = allCatProducts.filter(p => 
                p.slug === subSlug || 
                (p.subCategory && p.subCategory.toLowerCase().includes(subSlug.replace(/-/g, ' ')))
             );
             
             // Fallback if subcategory filter yields nothing
             if(filteredProducts.length === 0) {
                 filteredProducts = allCatProducts;
             }
        } else if (allCatProducts) {
            filteredProducts = allCatProducts;
        }

        setProducts(filteredProducts);
        setLoading(false);
    }, [slug, subSlug]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        addToCart(product, 1, false);
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#f39200] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="w-full bg-[#fdfbf7]/30 py-10 px-4 md:px-8 min-h-[70vh]">
            <div className="max-w-[1400px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs md:text-sm mb-6 bg-white p-3 md:px-5 rounded-lg shadow-sm border border-gray-100">
                    <Link href="/" className="text-gray-500 hover:text-[#f39200] flex items-center gap-1">
                        Home
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-[#f39200] capitalize font-medium">
                        {slug ? slug.replace(/-/g, ' ') : ''} {subSlug ? `/ ${subSlug.replace(/-/g, ' ')}` : ''}
                    </span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-2 border-gray-100 pb-4">
                    <div className="relative">
                        <h1 className="text-[#1a2b3c] text-3xl font-black capitalize">
                            {subSlug ? subSlug.replace(/-/g, ' ') : (slug ? slug.replace(/-/g, ' ') : '')} Products
                        </h1>
                        <div className="absolute bottom-[-18px] left-0 w-2/3 h-[3px] bg-[#f39200]"></div>
                    </div>
                </div>

                {!products || products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <h2 className="text-2xl font-bold text-gray-500 mb-2">No products found</h2>
                        <p className="text-gray-400 mb-6">We couldn't find any products in this category.</p>
                        <Link href="/" className="bg-[#f39200] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#e08600] transition-colors">
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <Link
                                href={`/product/${product.slug}`}
                                key={product.id}
                                className="group bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-orange-100 relative"
                            >
                                {/* Tag/Discount Badge */}
                                <div className="flex justify-between items-start mb-2 pointer-events-none z-10 relative">
                                    {product.badge ? (
                                        <span className="bg-[#f39200] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            {product.badge}
                                        </span>
                                    ) : product.isOrganic ? (
                                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            Organic
                                        </span>
                                    ) : <div />}
                                    
                                    {product.originalPrice && product.price && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Product Image */}
                                <div className="h-40 md:h-52 flex items-center justify-center mb-4 overflow-hidden bg-[#fafafa] rounded-lg border border-gray-50 relative -mt-6">
                                    <img
                                        src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                                        alt={product.name}
                                        className="max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-[#1a2b3c] text-xs md:text-base font-bold mb-1 line-clamp-2 leading-tight group-hover:text-[#f39200] transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    <span className="text-[10px] text-gray-400 mb-3 block">
                                        {product.unit || 'Standard'}
                                    </span>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-2 mb-4 mt-auto">
                                        <span className="text-[#f39200] text-lg md:text-xl font-black">৳{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-xs md:text-sm font-medium">৳{product.originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-auto text-xs w-full">
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={!product.inStock}
                                            className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-md font-semibold transition-all ${
                                                product.inStock 
                                                ? 'border-[#f39200] text-[#f39200] hover:bg-[#f39200] hover:text-white'
                                                : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                            }`}
                                        >
                                            <ShoppingCart size={14} />
                                            Add
                                        </button>
                                        <button 
                                            onClick={(e) => handleBuyNow(e, product)}
                                            disabled={!product.inStock}
                                            className={`flex-1 py-2 rounded-md font-semibold text-white shadow-sm text-center transition-colors ${
                                                product.inStock 
                                                ? 'bg-[#f39200] hover:bg-[#e08600]'
                                                : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                                            }`}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryPage;