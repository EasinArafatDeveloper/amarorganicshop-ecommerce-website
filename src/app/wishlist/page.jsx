"use client";

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { Heart, Trash2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, isLoaded } = useWishlist();
    const { addToCart } = useCart();

    if (!isLoaded) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="fill-transparent" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any favorite products yet.</p>
                    <Link href="/" className="inline-block w-full bg-secondary text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all shadow-md">
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    const moveToCart = (item) => {
        addToCart(item, 1, true);
        removeFromWishlist(item.id);
        toast.success("Moved to cart!");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-secondary transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
                            <Heart className="text-red-500 fill-red-500" size={28} />
                            My Wishlist
                        </h1>
                    </div>
                    <span className="bg-white px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-gray-100 text-gray-600">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow relative group flex flex-col h-full animate-in fade-in duration-300">
                            {/* Remove Button */}
                            <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:text-white"
                                title="Remove from wishlist"
                            >
                                <Trash2 size={16} />
                            </button>

                            <Link href={`/product/${item.slug}`} className="block h-48 bg-gray-50 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                            </Link>
                            
                            <div className="flex-1 flex flex-col">
                                <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">{item.category}</div>
                                <Link href={`/product/${item.slug}`} className="block">
                                    <h3 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-secondary transition-colors line-clamp-2">{item.name}</h3>
                                    {item.nameBn && <p className="text-xs text-gray-500 mb-2">{item.nameBn}</p>}
                                </Link>
                                
                                <div className="mt-auto pt-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium mb-0.5">{item.unit}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-lg text-secondary">৳{item.price}</span>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <span className="text-xs text-gray-400 line-through">৳{item.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => moveToCart(item)}
                                        className="w-10 h-10 bg-[#04211c] text-white rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
                                        title="Move to Cart"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
