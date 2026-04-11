'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";

    const discountPercentage = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const renderRating = (rating = 0) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={i}
                    className="fill-secondary text-secondary"
                    size={13}
                />
            );
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className="text-gray-200 fill-gray-200"
                    size={13}
                />
            );
        }

        return stars;
    };

    return (
        <div className="bg-white rounded-2xl p-4 flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 relative group border border-gray-100">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                {product.isOrganic && (
                    <div className="bg-[#8ec63f] text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider backdrop-blur-sm">
                        Organic
                    </div>
                )}
                {product.badge && (
                    <div className="bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                        {product.badge}
                    </div>
                )}
                {discountPercentage > 0 && (
                    <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-sm ring-1 ring-white/50 flex items-center gap-0.5 animate-pulse">
                        <svg className="w-2.5 h-2.5 md:w-3 md:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                        {discountPercentage}% OFF
                    </div>
                )}
            </div>

            {/* Image Box */}
            <Link href={`/product/${product.slug}`} className="block relative">
                <div className="w-full h-[180px] sm:h-[200px] relative mb-4 overflow-hidden bg-gray-50/80 rounded-xl group-hover:bg-gray-100/50 transition-colors">
                    <Image
                        src={product.image || fallbackImage}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Hover Fade Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300 rounded-xl pointer-events-none"></div>
                </div>
            </Link>

            {/* Content Area */}
            <div className="flex flex-col flex-1">
                {/* Category & Rating Row */}
                <div className="flex items-center justify-between mb-2">
                    {product.category && (
                        <Link
                            href={`/${product.category}`}
                            className="text-[10px] text-gray-400 hover:text-secondary uppercase font-bold tracking-wider transition-colors"
                        >
                            {product.category}
                        </Link>
                    )}
                    {product.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50/50 px-1.5 py-0.5 rounded">
                            <Star size={10} className="fill-secondary text-secondary" />
                            <span className="text-[10px] font-bold text-gray-600">
                                {product.rating} <span className="text-gray-400 font-normal">({product.reviewCount || 0})</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <Link href={`/product/${product.slug}`} className="block group/title">
                    <h3 className="text-[#1a2b3c] font-bold text-base leading-snug mb-1 line-clamp-2 min-h-[2.5rem] group-hover/title:text-secondary transition-colors">
                        {product.name}
                    </h3>
                    {product.nameBn && (
                        <p className="text-xs text-gray-500 font-medium mb-2">{product.nameBn}</p>
                    )}
                </Link>

                <div className="border-t border-dashed border-gray-200 mt-2 mb-3"></div>

                {/* Bottom Row: Price & Action */}
                <div className="mt-auto">
                    <div className="flex items-end justify-between gap-2 mb-3">
                        <div className="flex flex-col">
                            {product.originalPrice && (
                                <span className="text-gray-400 text-xs line-through font-medium mb-0.5">
                                    ৳{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-secondary font-black text-xl tracking-tight leading-none">
                                    ৳{product.price.toLocaleString()}
                                </span>
                                {product.unit && (
                                    <span className="text-[10px] text-gray-400 font-medium uppercase">
                                        / {product.unit}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Status UI */}
                        {product.inStock !== undefined && (
                            <div className="text-right">
                                {product.inStock ? (
                                    <span className="inline-flex items-center gap-1 text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-red-500 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-full">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // prevent triggering parent links if any
                            if (onAddToCart) onAddToCart(product);
                        }}
                        disabled={product.inStock === false}
                        className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-sm overflow-hidden relative group/btn ${product.inStock === false
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:shadow-[0_4px_15px_rgba(22,163,74,0.3)]'
                            }`}
                    >
                        {/* CSS effect for button */}
                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        
                        <div className="relative z-10 flex items-center gap-2">
                            <ShoppingCart size={16} className={product.inStock !== false ? "animate-bounce-hover" : ""} />
                            <span>{product.inStock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;