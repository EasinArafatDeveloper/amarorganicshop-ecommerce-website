"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard'; // Implemented the unified ProductCard redesign

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
                // Find products badged as Best Seller, fallback to first 4 if none.
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

    if (loading) {
        return (
            <section className="w-full bg-[#fcfcfc] py-14 px-4 md:px-6 relative">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-10">
                        <div className="h-8 md:h-10 w-64 bg-gray-200 animate-pulse mx-auto rounded-lg mb-4"></div>
                        <div className="h-4 w-48 bg-gray-200 animate-pulse mx-auto rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 h-[380px] animate-pulse">
                                <div className="w-full h-[180px] bg-gray-100 rounded-xl mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                    <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-10 bg-gray-100 rounded w-full mt-6"></div>
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
        <section className="w-full bg-[#fcfcfc] py-14 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Section header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            <span className="text-text-secondary text-sm font-bold uppercase tracking-wider text-secondary">Most Popular</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] tracking-tight">
                            {customTitle}
                        </h2>
                    </div>
                </div>

                {/* Vertical Premium Grid using ProductCard */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="h-full transform transition-all duration-300">
                            <ProductCard 
                                product={product} 
                                onAddToCart={handleAddToCart} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopSellingProducts;