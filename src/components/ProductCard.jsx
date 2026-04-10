'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';

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
                    className="fill-yellow-400 text-yellow-400"
                    size={12}
                />
            );
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className="text-gray-300"
                    size={12}
                />
            );
        }

        return stars;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow relative group">
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {product.isOrganic && (
                    <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Organic
                    </span>
                )}

                {product.badge && (
                    <span className="bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {product.badge}
                    </span>
                )}

                {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        -{discountPercentage}%
                    </span>
                )}
            </div>

            {/* Product Image */}
            <Link href={`/product/${product.slug}`} className="block">
                <div className="w-full h-[150px] sm:h-[165px] relative mb-2 overflow-hidden bg-gray-100 rounded-lg">
                    <Image
                        src={product.image || fallbackImage}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex flex-col flex-1">
                {/* Category */}
                {product.category && (
                    <Link
                        href={`/${product.category}`}
                        className="text-[10px] text-gray-400 hover:text-secondary mb-1 inline-block uppercase"
                    >
                        {product.category}
                    </Link>
                )}

                {/* Product Name */}
                <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="text-[#1a2b3c] font-semibold text-sm leading-tight mb-1 line-clamp-2 min-h-[2.4rem] hover:text-secondary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center gap-0.5">
                            {renderRating(product.rating)}
                        </div>
                        <span className="text-[10px] text-gray-400">
                            ({product.reviewCount || 0})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-secondary font-black text-base">
                            ৳{product.price.toLocaleString()}
                        </span>

                        {product.originalPrice && (
                            <span className="text-gray-400 text-[10px] line-through">
                                ৳{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {product.unit && (
                        <span className="text-[10px] text-gray-400">
                            {product.unit}
                        </span>
                    )}
                </div>

                {/* Stock */}
                {product.inStock !== undefined && (
                    <div className="mb-2">
                        {product.inStock ? (
                            <span className="text-green-500 text-[10px] font-medium">
                                ✓ In Stock
                            </span>
                        ) : (
                            <span className="text-red-500 text-[10px] font-medium">
                                ✗ Out of Stock
                            </span>
                        )}
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={() => onAddToCart && onAddToCart(product)}
                    disabled={product.inStock === false}
                    className={`w-full mt-auto py-2 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 font-medium text-xs ${product.inStock === false
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border border-secondary text-secondary hover:bg-secondary hover:text-white'
                        }`}
                >
                    <ShoppingCart size={14} />
                    <span>{product.inStock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;