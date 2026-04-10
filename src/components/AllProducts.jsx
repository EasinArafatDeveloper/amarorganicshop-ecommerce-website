"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

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
                        <div className="absolute bottom-[-18px] left-0 w-full h-[3px] bg-[#f39200]"></div>
                    </div>

                    <button className="flex items-center gap-1 text-[#f39200] font-bold text-sm underline uppercase tracking-wider">
                        View All Items <ArrowRight size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#f39200]">
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
                                <div className="flex justify-between items-start mb-2 pointer-events-none">
                                    {product.badge ? (
                                        <span className="bg-[#f39200] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            {product.badge}
                                        </span>
                                    ) : <div />}
                                    
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="bg-[#4caf50] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            OFF
                                        </span>
                                    )}
                                </div>

                                {/* Product Image */}
                                <div className="h-40 md:h-52 flex items-center justify-center mb-4 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-[#1a2b3c] text-xs md:text-base font-bold mb-2 line-clamp-2 min-h-[32px] md:min-h-[48px]">
                                        {product.name}
                                    </h3>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[#f39200] text-lg md:text-xl font-black">৳{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-xs md:text-sm font-medium">৳{product.originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-auto text-xs">
                                        <button 
                                            onClick={() => addToCart(product, 1)} 
                                            className="flex-1 flex items-center justify-center gap-1.5 border border-[#f39200] text-[#f39200] py-2 rounded-md font-semibold transition-all hover:bg-[#f39200] hover:text-white"
                                        >
                                            <ShoppingCart size={14} />
                                            Add
                                        </button>
                                        <button 
                                            onClick={() => handleBuyNow(product)} 
                                            className="flex-1 bg-[#f39200] text-white py-2 rounded-md font-semibold hover:bg-[#e08600] transition-colors shadow-sm text-center"
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