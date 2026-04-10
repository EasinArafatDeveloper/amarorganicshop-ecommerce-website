"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getTopSellingProducts } from '@/lib/data/productsData';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

const TopSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const topProducts = getTopSellingProducts();
        setProducts(topProducts);
        setLoading(false);
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
            <section className="w-full bg-[#fcfcfc] py-10 px-4 md:px-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-[#1a2b3c] text-2xl md:text-3xl font-medium tracking-tight">
                            Top Selling Products
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-4 animate-pulse"
                            >
                                <div className="w-24 h-24 bg-gray-200 rounded-md shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-full"></div>
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
        <section className="w-full bg-[#fcfcfc] py-10 px-4 md:px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="text-[#1a2b3c] text-2xl md:text-3xl font-medium tracking-tight">
                        Top Selling Products
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Most popular items among our customers
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 relative shadow-sm hover:shadow-md transition-all group"
                        >
                            {/* Badge */}
                            <div
                                className={`absolute top-0 right-0 ${product.badge === 'Best Selling'
                                        ? 'bg-red-500'
                                        : 'bg-[#f39200]'
                                    } text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-lg rounded-tr-xl z-10 flex items-center gap-1`}
                            >
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                {product.badge || 'Top Selling'}
                            </div>

                            {/* Product Image */}
                            <Link
                                href={`/product/${product.slug}`}
                                className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-[#fafafa]"
                            >
                                <img
                                    src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                                    }}
                                />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0 flex flex-col">
                                {/* Category */}
                                <Link
                                    href={`/${product.category}`}
                                    className="text-[10px] text-gray-400 hover:text-[#f39200] uppercase mb-1"
                                >
                                    {product.category}
                                </Link>

                                {/* Product Name */}
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-[#1a2b3c] text-sm sm:text-base font-bold leading-snug line-clamp-2 hover:text-[#f39200] transition-colors mb-1">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-gray-500 text-xs line-clamp-1 mb-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Rating + Price */}
                                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                                    {product.rating ? (
                                        <div className="flex items-center gap-1 shrink-0">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-gray-400">
                                                ({product.reviewCount || 0})
                                            </span>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[#f39200] text-base sm:text-lg font-black">
                                            ৳{product.price.toLocaleString()}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-xs">
                                                ৳{product.originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Unit + Stock */}
                                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                                    <div className="text-gray-400">
                                        {product.unit ? product.unit : ''}
                                    </div>

                                    {product.inStock !== undefined && (
                                        product.inStock ? (
                                            <span className="text-green-500 font-medium">
                                                ✓ In Stock
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-medium">
                                                ✗ Out of Stock
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Savings */}
                                {product.originalPrice && product.price && (
                                    <div className="mb-2">
                                        <span className="bg-[#8ec63f] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            Save ৳{(product.originalPrice - product.price).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-auto">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.inStock === false}
                                        className={`flex-1 flex items-center justify-center gap-1.5 border border-[#f39200] text-[#f39200] py-2 rounded-md font-semibold text-xs transition-colors ${product.inStock === false
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-orange-50'
                                            }`}
                                    >
                                        <ShoppingCart size={14} />
                                        Add
                                    </button>

                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        disabled={product.inStock === false}
                                        className={`flex-1 bg-[#f39200] text-white py-2 rounded-md font-semibold text-xs hover:bg-[#e08600] transition-colors shadow-sm text-center ${product.inStock === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopSellingProducts;