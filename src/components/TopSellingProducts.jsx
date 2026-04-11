"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

const TopSellingProducts = ({ customTitle = 'Top Selling Products' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchTopSelling = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                const topProducts = data.filter(p => p.badge === 'Best Seller').slice(0, 4);
                if (topProducts.length > 0) {
                    setProducts(topProducts);
                } else {
                    setProducts(data.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to load top products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopSelling();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    const handleBuyNow = (product) => {
        addToCart(product, 1, false);
        router.push('/checkout');
    };

    if (loading) {
        return (
            <section className="w-full bg-[#fafafa] py-10 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-8 md:h-10 w-64 bg-gray-200 animate-pulse mx-auto rounded-lg"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 flex gap-6 animate-pulse">
                                <div className="w-[140px] md:w-[180px] h-[180px] bg-gray-100 rounded-lg"></div>
                                <div className="flex-1 space-y-4 py-4">
                                    <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-10 bg-gray-100 rounded w-full mt-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="w-full bg-[#fafafa] py-10 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Section Title */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-[28px] font-semibold text-[#1a2b3c] tracking-normal">
                        {customTitle}
                    </h2>
                </div>

                {/* Product Horizontal Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-6 relative shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 group"
                        >
                            {/* Top Right Red Badge */}
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-[10px] rounded-tr-xl flex items-center gap-1 z-10">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                                {product.badge || 'Best Selling'}
                            </div>

                            {/* Left Product Image */}
                            <Link
                                href={`/product/${product.slug}`}
                                className="w-[120px] sm:w-[180px] shrink-0 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <img
                                    src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </Link>

                            {/* Right Product Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                                {/* Title */}
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-[#1a2b3c] text-base sm:text-[17px] font-semibold leading-snug hover:text-secondary transition-colors mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Price Row */}
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <span className="text-secondary text-lg sm:text-[20px] font-bold">
                                        ৳{product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-gray-400 font-medium line-through text-sm">
                                            ৳{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Save Savings Pill */}
                                {product.originalPrice && product.price && (
                                    <div className="mb-4">
                                        <span className="bg-[#8ec63f] text-white text-[11px] font-bold px-3 py-1 rounded-sm tracking-wide">
                                            Save ৳{(product.originalPrice - product.price).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {/* Spacer equivalent */}
                                <div className="mt-auto"></div>

                                {/* Action Buttons - Restrained width like original */}
                                <div className="flex items-center gap-3 w-full max-w-[320px] mt-4">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.inStock === false}
                                        className={`flex-1 flex items-center justify-center gap-2 border border-secondary text-secondary py-2 rounded font-semibold text-sm transition-all hover:bg-secondary/5 ${product.inStock === false
                                                ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                                                : ''
                                            }`}
                                    >
                                        <ShoppingCart size={16} strokeWidth={2.5} />
                                        Add To Cart
                                    </button>

                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        disabled={product.inStock === false}
                                        className={`flex-1 flex items-center justify-center gap-2 bg-secondary text-white border border-secondary py-2 rounded font-semibold text-sm transition-all hover:brightness-95 shadow-sm ${product.inStock === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <ShoppingCart size={16} strokeWidth={2.5} />
                                        Buy now
                                    </button>
                                </div>
                                
                                {/* Out of Stock Warning */}
                                {product.inStock === false && (
                                    <p className="text-red-500 text-xs font-bold mt-2">Currently Out of Stock</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopSellingProducts;