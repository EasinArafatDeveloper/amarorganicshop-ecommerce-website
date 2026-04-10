"use client";
import React from 'react';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

const AllProducts = () => {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = (product) => {
        addToCart(product, 1, false);
        router.push('/checkout');
    };
    // Mock data for 12 products (Mix)
    const products = [
        { id: 101, name: "Premium Mustard Oil", price: 450, oldPrice: 500, unit: "1L", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Organic" },
        { id: 102, name: "Black Seed Honey", price: 850, oldPrice: 950, unit: "500g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Top Rated" },
        { id: 103, name: "Desi Ghee", price: 1200, oldPrice: 1400, unit: "900g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Pure" },
        { id: 104, name: "Chia Seeds", price: 350, oldPrice: 400, unit: "250g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: null },
        { id: 105, name: "Pink Salt", price: 150, oldPrice: 180, unit: "500g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "New" },
        { id: 106, name: "Makhana", price: 450, oldPrice: 500, unit: "100g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: null },
        { id: 107, name: "Organic Turmeric", price: 220, oldPrice: 250, unit: "200g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Farm Fresh" },
        { id: 108, name: "Coconut Oil", price: 550, oldPrice: 650, unit: "500ml", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: null },
        { id: 109, name: "Dry Dates (Ajwa)", price: 1800, oldPrice: 2000, unit: "1kg", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Imported" },
        { id: 110, name: "Peanut Butter", price: 480, oldPrice: 550, unit: "350g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "High Protein" },
        { id: 111, name: "Green Tea", price: 320, oldPrice: 380, unit: "100g", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: null },
        { id: 112, name: "Wild Honey", price: 1100, oldPrice: 1300, unit: "1kg", image: "https://admin.ghorerbazarbd.com/storage/products/1689676602.jpg", tag: "Wild" },
    ];

    return (
        <section className="w-full bg-[#fdfbf7]/30 py-16 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-gray-100 pb-4">
                    <div className="relative">
                        <h2 className="text-[#1a2b3c] text-2xl md:text-3xl font-black">All Products</h2>
                        <div className="absolute bottom-[-18px] left-0 w-full h-[3px] bg-[#f39200]"></div>
                    </div>

                    <button className="flex items-center gap-1 text-[#f39200] font-bold text-sm underline uppercase tracking-wider">
                        View All Items <ArrowRight size={18} />
                    </button>
                </div>

                {/* Products Grid (Natal style) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-orange-100 relative"
                        >
                            {/* Tag/Discount Badge */}
                            <div className="flex justify-between items-start mb-2 pointer-events-none">
                                {product.tag ? (
                                    <span className="bg-[#f39200] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                        {product.tag}
                                    </span>
                                ) : <div />}
                                <span className="bg-[#4caf50] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                    OFF
                                </span>
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

                                {/* Pricing (Style natal 45597c) */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[#f39200] text-lg md:text-xl font-black">৳{product.price}</span>
                                    {product.oldPrice && (
                                        <span className="text-gray-400 line-through text-xs md:text-sm font-medium">৳{product.oldPrice}</span>
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
            </div>
        </section>
    );
};

export default AllProducts;