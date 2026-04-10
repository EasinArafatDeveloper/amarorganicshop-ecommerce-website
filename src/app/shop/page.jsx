"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Filter, ArrowUpDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import { getAllProducts } from '@/lib/data/productsData';
import { useCart } from '@/lib/contexts/CartContext';

const ShopPage = () => {
    const router = useRouter();
    const { addToCart } = useCart();
    const allProducts = getAllProducts();

    // States
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOption, setSortOption] = useState('default');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Derive unique categories from products
    const uniqueCategories = useMemo(() => {
        const categories = new Set();
        allProducts.forEach(p => {
            if (p.category) categories.add(p.category);
        });
        return Array.from(categories).map(cat => ({
            id: cat,
            name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));
    }, [allProducts]);

    // Format human-readable title for current category
    const categoryTitle = selectedCategory === 'all' 
        ? 'All Products' 
        : uniqueCategories.find(c => c.id === selectedCategory)?.name || 'Products';

    // Filter and Sort Logic
    const displayedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // 1. Filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // 2. Sort
        if (sortOption === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name-a') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [allProducts, selectedCategory, sortOption]);

    // Handlers
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        addToCart(product, 1, false);
        router.push('/checkout');
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-16">
            {/* Header Banner */}
            <div className="bg-[#04211c] text-white py-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f39200] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="max-w-[1400px] mx-auto relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-2">Our Shop</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-medium">
                        <Link href="/" className="hover:text-[#f39200] transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#f39200]">Shop</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 text-gray-700 font-bold hover:text-[#f39200] transition-colors"
                        >
                            <SlidersHorizontal size={20} />
                            Filter Products
                        </button>
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={16} className="text-gray-400" />
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                            >
                                <option value="default">Default Sort</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Sidebar Filters (Desktop & Mobile Overlay) */}
                    <div className={`fixed inset-0 z-[100] lg:static lg:block lg:w-1/4 lg:z-auto transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        {/* Overlay to close mobile sidebar */}
                        {isMobileFilterOpen && (
                            <div 
                                className="absolute inset-0 bg-black/60 lg:hidden"
                                onClick={() => setIsMobileFilterOpen(false)}
                            />
                        )}
                        
                        <div className="absolute top-0 left-0 h-full w-[280px] bg-white lg:bg-transparent lg:static lg:h-auto lg:w-full p-6 lg:p-0 overflow-y-auto lg:overflow-visible">
                            <div className="flex justify-between items-center lg:hidden mb-6">
                                <h3 className="font-black text-xl text-gray-800">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-white lg:border lg:border-gray-200 rounded-2xl lg:p-6 lg:shadow-sm">
                                <h3 className="font-black text-lg text-gray-800 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                                    <Filter size={18} className="text-[#f39200]" />
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => { setSelectedCategory('all'); setIsMobileFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'all' ? 'bg-orange-50 text-[#f39200] border-l-4 border-[#f39200]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                    >
                                        All Products
                                    </button>
                                    
                                    {uniqueCategories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setIsMobileFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat.id ? 'bg-orange-50 text-[#f39200] border-l-4 border-[#f39200]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full lg:w-3/4">
                        
                        {/* Desktop Utility Bar */}
                        <div className="hidden lg:flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                            <h2 className="text-lg font-black text-gray-800">
                                {categoryTitle} <span className="text-gray-400 font-medium text-sm ml-2">({displayedProducts.length} items)</span>
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">Sort by:</span>
                                <div className="relative bg-gray-50 border border-gray-200 rounded-lg pr-4 pl-2 py-1.5 focus-within:border-[#f39200] focus-within:ring-2 focus-within:ring-[#f39200]/20 transition-all">
                                    <select 
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer w-full appearance-none pr-6 pl-2"
                                    >
                                        <option value="default">Default Match</option>
                                        <option value="name-a">A-Z By Name</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ArrowUpDown size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile specific title count */}
                        <div className="lg:hidden mb-4 px-2">
                            <h2 className="text-base font-black text-gray-800">
                                {categoryTitle} <span className="text-gray-400 font-medium text-sm ml-1">({displayedProducts.length} items)</span>
                            </h2>
                        </div>

                        {/* Product Grid */}
                        {displayedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {displayedProducts.map((product) => (
                                    <Link key={product.id} href={`/product/${product.slug}`}>
                                        <div className="group bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-orange-100 relative">
                                            
                                            {/* Tag/Discount Badge */}
                                            <div className="flex justify-between items-start mb-2 pointer-events-none">
                                                {product.badge ? (
                                                    <span className="bg-[#f39200] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                        {product.badge}
                                                    </span>
                                                ) : <div />}
                                                {product.originalPrice && (
                                                    <span className="bg-[#4caf50] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                        OFF
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Image */}
                                            <div className="h-32 md:h-44 flex items-center justify-center mb-4 overflow-hidden bg-gray-50 rounded-lg pointer-events-none">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 p-2 md:p-4"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex flex-col flex-grow pointer-events-none">
                                                <h3 className="text-[#1a2b3c] text-xs md:text-sm font-bold mb-1.5 line-clamp-2 min-h-[32px] md:min-h-[40px] group-hover:text-[#f39200] transition-colors">
                                                    {product.name}
                                                </h3>

                                                {/* Pricing */}
                                                <div className="flex flex-wrap items-end gap-2 mb-4">
                                                    <span className="text-[#f39200] text-base md:text-lg font-black leading-none">৳{product.price}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-gray-400 line-through text-xs font-medium leading-none mb-0.5">৳{product.originalPrice}</span>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2 mt-auto text-xs w-full pointer-events-auto">
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
                                                        <span className="md:inline hidden">Add</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleBuyNow(e, product)}
                                                        disabled={!product.inStock}
                                                        className={`flex-[2] py-2 rounded-md font-semibold text-white shadow-sm text-center transition-colors ${
                                                            product.inStock 
                                                            ? 'bg-[#f39200] hover:bg-[#e08600]'
                                                            : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                                                        }`}
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[40vh]">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Filter size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any products matching your current filters. Try selecting a different category.</p>
                                <button 
                                    onClick={() => setSelectedCategory('all')}
                                    className="mt-6 font-bold text-[#f39200] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
