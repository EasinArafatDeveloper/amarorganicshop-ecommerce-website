"use client";
import React, { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    User,
    Heart,
    ShoppingCart,
    Menu,
    ChevronDown,
    X,
    ChevronRight,
    Info,
    HelpCircle,
    ShoppingBag
} from 'lucide-react';

const StickyNavWrapper = ({ children }) => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 120) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`${isSticky ? 'fixed top-0 left-0 w-full z-[999] shadow-lg bg-[#04211c]' : 'relative'}`}>
            {children}
        </div>
    );
};

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Category data structure with sub-categories
    const categories = [
        { name: "Oil & Ghee", hasSub: false },
        {
            name: "Honey",
            hasSub: true,
            subItems: ["Sundarban Honey", "Litchi Flower Honey", "Black Seed Honey", "Mustard Flower Honey"]
        },
        {
            name: "Dates",
            hasSub: true,
            subItems: ["Ajwa Dates", "Mariyam Dates", "Medjool Dates", "Mabroom Dates"]
        },
        {
            name: "Spices",
            hasSub: true,
            subItems: ["Turmeric Powder", "Chili Powder", "Coriander Powder", "Mixed Spices"]
        },
        {
            name: "Nuts & Seeds",
            hasSub: true,
            subItems: ["Almonds", "Cashews", "Walnuts", "Chia Seeds", "Pumpkin Seeds"]
        },
        {
            name: "Beverage",
            hasSub: true,
            subItems: ["Tea", "Coffee", "Juice"]
        },
        { name: "Rice", hasSub: false },
        {
            name: "Flours & Lentils",
            hasSub: true,
            subItems: ["Atta", "Maida", "Masoor Dal", "Moong Dal"]
        },
        { name: "Certified", hasSub: false },
        { name: "Pickle", hasSub: false },
    ];

    return (
        <>
            <header className="w-full font-sans shadow-sm relative">
                {/* Universal Overlay */}
                {(isDrawerOpen || isCartOpen) && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[60]"
                        onClick={() => {
                            setIsDrawerOpen(false);
                            setIsCartOpen(false);
                        }}
                    />
                )}

                {/* Left Side Drawer (Mobile) */}
                <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-[#f39200] p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                            <User className="text-white w-7 h-7" />
                        </div>
                        <div className="text-white">
                            <p className="text-sm font-medium leading-tight">Hello there!</p>
                            <p className="text-lg font-bold leading-tight">Signin</p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search in..."
                                className="w-full bg-[#f2f2f2] rounded-full py-2 px-4 pr-10 focus:outline-none text-sm text-gray-600 border border-gray-100"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="bg-[#f7f7f7] rounded-lg overflow-hidden border border-gray-100">
                            {categories.map((cat, index) => (
                                <div key={index} className="bg-white border-b border-gray-50 last:border-0">
                                    <div className="flex items-center justify-between p-3.5 cursor-pointer active:bg-gray-50">
                                        <span className="text-[14px] text-gray-700 font-medium">{cat.name}</span>
                                        {cat.hasSub && <ChevronRight size={18} className="text-gray-400" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 px-2">
                            <h3 className="text-gray-800 font-bold text-base mb-3 border-b-2 border-[#f39200] w-fit pb-1">Quick Links</h3>
                            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 p-3.5 border-b border-gray-50">
                                    <div className="p-1.5 bg-gray-50 rounded-md"><Info size={18} className="text-gray-600" /></div>
                                    <span className="text-[14px] font-medium text-gray-700">About Us</span>
                                </div>
                                <div className="flex items-center gap-3 p-3.5 border-b border-gray-50">
                                    <div className="p-1.5 bg-gray-50 rounded-md"><Heart size={18} className="text-gray-600" /></div>
                                    <span className="text-[14px] font-medium text-gray-700">Wishlists</span>
                                </div>
                                <div className="flex items-center gap-3 p-3.5">
                                    <div className="p-1.5 bg-gray-50 rounded-md"><HelpCircle size={18} className="text-gray-600" /></div>
                                    <span className="text-[14px] font-medium text-gray-700">Faqs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Cart Drawer */}
                <div className={`fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="text-[#f39200]" size={20} />
                            <span className="font-bold text-gray-800">Shopping Cart (0)</span>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                        <ShoppingCart size={60} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Your cart is empty</p>
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full bg-[#1a2b3c] text-white py-3 rounded-lg font-bold">Checkout</button>
                    </div>
                </div>

                {/* Main Header Bar */}
                <div className="bg-[#fcfcfc] border-b border-gray-100 py-3 md:py-4 px-4 md:px-8">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 md:gap-8">

                        <div className="flex items-center justify-between w-full md:w-auto">
                            <div className="md:hidden">
                                <Menu className="w-7 h-7 text-[#1a2b3c] cursor-pointer" onClick={() => setIsDrawerOpen(true)} />
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-2 flex-1 md:flex-none">
                                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#f39200] rounded-lg flex items-center justify-center p-1 shrink-0">
                                    <svg viewBox="0 0 24 24" className="text-[#f39200] fill-current w-full h-full">
                                        <path d="M12 2C7 2 3 6 3 11s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7zm-1-10c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1s-1-.4-1-1V8z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col leading-none text-left shrink-0">
                                    <span className="text-[#f39200] font-black text-base md:text-lg tracking-tight uppercase leading-none">Ghorer</span>
                                    <span className="text-[#f39200] font-black text-base md:text-lg tracking-tight uppercase leading-none">Bazar</span>
                                </div>
                            </div>

                            <div className="md:hidden">
                                <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                                    <ShoppingCart className="w-6 h-6 text-[#1a2b3c]" />
                                    <span className="absolute -top-1.5 -right-2 bg-[#f39200] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block md:flex-1 md:max-w-2xl relative">
                            <input
                                type="text"
                                placeholder="Search in..."
                                className="w-full bg-[#f2f2f2] rounded-full py-2.5 px-6 pr-12 focus:outline-none text-gray-600 text-sm"
                            />
                            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer" />
                        </div>

                        <div className="hidden md:flex items-center gap-5 lg:gap-7 shrink-0">
                            <div className="flex flex-col items-center cursor-pointer group text-center">
                                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-[#1a2b3c] group-hover:text-[#f39200]" />
                                <span className="text-[10px] lg:text-[11px] font-medium text-[#1a2b3c] mt-1">Track Order</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer group text-center">
                                <User className="w-5 h-5 lg:w-6 lg:h-6 text-[#1a2b3c] group-hover:text-[#f39200]" />
                                <span className="text-[10px] lg:text-[11px] font-medium text-[#1a2b3c] mt-1">Sign In</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer group text-center">
                                <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-[#1a2b3c] group-hover:text-[#f39200]" />
                                <span className="text-[10px] lg:text-[11px] font-medium text-[#1a2b3c] mt-1">Wishlist</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer group relative text-center" onClick={() => setIsCartOpen(true)}>
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-[#1a2b3c] group-hover:text-[#f39200]" />
                                    <span className="absolute -top-1.5 -right-2 bg-[#f39200] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                                </div>
                                <span className="text-[10px] lg:text-[11px] font-medium text-[#1a2b3c] mt-1">Cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Desktop Navigation */}
            <StickyNavWrapper>
                <nav className="hidden md:block bg-[#04211c] w-full text-white relative z-50">
                    <div className="max-w-[1400px] mx-auto px-8 whitespace-nowrap">
                        <ul className="flex items-center gap-7 text-[13px] font-medium h-11">
                            {categories.map((cat, i) => (
                                <li
                                    key={i}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(i)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-orange-400 transition-colors h-full">
                                        {cat.name}
                                        {cat.hasSub && <ChevronDown size={14} className="opacity-60" />}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {cat.hasSub && activeDropdown === i && (
                                        <div className="absolute top-[100%] left-0 bg-white text-gray-800 shadow-xl border-t-2 border-[#f39200] py-2 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {cat.subItems.map((sub, subIdx) => (
                                                <div
                                                    key={subIdx}
                                                    className="px-4 py-2.5 hover:bg-orange-50 hover:text-[#f39200] text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between group/item"
                                                >
                                                    {sub}
                                                    <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </StickyNavWrapper>
        </>
    );
};

export default Navbar;