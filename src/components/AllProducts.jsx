"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AllProducts = ({ customTitle = 'All Products' }) => {
    const { addToCart } = useCart();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuyNow = (product) => {
        addToCart(product, 1, false);
        router.push('/checkout');
    };

    return (
        <section className="w-full bg-[#fdfbf7]/30 py-16 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-gray-100 pb-4">
                    <div className="relative">
                        <h2 className="text-[#1a2b3c] text-2xl md:text-3xl font-black">{customTitle}</h2>
                        <div className="absolute bottom-[-18px] left-0 w-full h-[3px] bg-secondary"></div>
                    </div>

                    <button className="flex items-center gap-1 text-secondary font-bold text-sm underline uppercase tracking-wider">
                        View All Items <ArrowRight size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="text-[#1a2b3c] font-semibold animate-pulse">Loading products from database...</p>
                    </div>
                ) : (
                    /* Products Grid (Natal style) */
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id || product.id}
                                className="group bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-orange-100 relative"
                            >
                                {/* Tag/Discount Badge */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none z-10">
                                    {product.badge && (
                                        <div className="bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                                            {product.badge}
                                        </div>
                                    )}
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm ring-1 ring-white/50 flex items-center gap-0.5 animate-pulse">
                                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Product Image */}
                                <Link href={`/product/${product.slug}`} className="block h-40 md:h-52 flex items-center justify-center mb-4 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex flex-col flex-grow">
                                    <Link href={`/product/${product.slug}`} className="block">
                                        <h3 className="text-[#1a2b3c] text-xs md:text-base font-bold mb-2 line-clamp-2 min-h-[32px] md:min-h-[48px] hover:text-secondary transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-secondary text-lg md:text-xl font-black">৳{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-xs md:text-sm font-medium">৳{product.originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-auto text-xs">
                                        <button 
                                            onClick={() => addToCart(product, 1)} 
                                            className="flex-1 flex items-center justify-center gap-1.5 border border-secondary text-secondary py-2 rounded-md font-semibold transition-all hover:bg-secondary hover:text-white"
                                        >
                                            <ShoppingCart size={14} />
                                            Add
                                        </button>
                                        <button 
                                            onClick={() => handleBuyNow(product)} 
                                            className="flex-1 bg-secondary text-white py-2 rounded-md font-semibold hover:bg-secondary hover:brightness-95 transition-colors shadow-sm text-center"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProducts;