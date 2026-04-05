"use client";
import React from 'react';
import { ShoppingCart } from 'lucide-react';

const TopSellingProducts = () => {
    const products = [
        {
            id: 1,
            name: "Sundarban Honey 1kg",
            currentPrice: 2200,
            oldPrice: 2500,
            saveAmount: 300,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Offered Items",
            badgeColor: "bg-[#ef4444]"
        },
        {
            id: 2,
            name: "Deshi Mustard Oil 5 liter",
            currentPrice: 1550,
            oldPrice: null,
            saveAmount: null,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Best Selling",
            badgeColor: "bg-[#ef4444]"
        },
        {
            id: 3,
            name: "Gawa Ghee 1kg",
            currentPrice: 1700,
            oldPrice: 1800,
            saveAmount: 100,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Best Selling",
            badgeColor: "bg-[#ef4444]"
        },
        {
            id: 4,
            name: "Lachcha Semai 1kg",
            currentPrice: 1300,
            oldPrice: 1500,
            saveAmount: 200,
            image: "https://ghorerbazarbd.com/_next/image?url=https%3A%2F%2Fadmin.ghorerbazarbd.com%2Fstorage%2Fproducts%2F1689676602.jpg&w=1920&q=75",
            badge: "Best Selling",
            badgeColor: "bg-[#ef4444]"
        }
    ];

    return (
        <section className="w-full bg-[#fcfcfc] py-12 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Section Title */}
                <div className="text-center mb-10">
                    <h2 className="text-[#1a2b3c] text-2xl md:text-3xl font-medium tracking-tight">
                        Top Selling Products
                    </h2>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-6 relative shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Badge */}
                            <div className={`absolute top-0 right-0 ${product.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10 flex items-center gap-1`}>
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                {product.badge}
                            </div>

                            {/* Product Image */}
                            <div className="w-full sm:w-1/3 aspect-square flex items-center justify-center overflow-hidden rounded-md">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain p-2"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="w-full sm:w-2/3 flex flex-col">
                                <h3 className="text-[#1a2b3c] text-lg font-bold mb-2">{product.name}</h3>

                                {/* Pricing */}
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[#f39200] text-xl font-black">৳{product.currentPrice.toLocaleString()}</span>
                                    {product.oldPrice && (
                                        <span className="text-gray-400 line-through text-sm">৳{product.oldPrice.toLocaleString()}</span>
                                    )}
                                </div>

                                {/* Savings Label */}
                                {product.saveAmount && (
                                    <div className="mb-4">
                                        <span className="bg-[#8ec63f] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                                            Save ৳{product.saveAmount}
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 mt-auto">
                                    <button className="flex-1 flex items-center justify-center gap-2 border border-[#f39200] text-[#f39200] py-2 rounded-md font-bold text-sm hover:bg-orange-50 transition-colors">
                                        <ShoppingCart size={16} />
                                        Add To Cart
                                    </button>
                                    <button className="flex-1 bg-[#f39200] text-white py-2 rounded-md font-bold text-sm hover:bg-[#e08600] transition-colors shadow-sm">
                                        Buy now
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