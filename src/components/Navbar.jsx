"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    ShoppingBag,
    Trash2,
    Minus,
    Plus
} from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

const StickyNavWrapper = ({ children }) => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 120);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`${isSticky ? 'fixed top-0 left-0 w-full z-[999] shadow-xl bg-[#04211c] animate-in fade-in slide-in-from-top-4 duration-300' : 'relative'}`}>
            {children}
        </div>
    );
};

// Category data with slugs for routing
const categories = [
    {
        name: "Honey",
        label: "মধু (Honey)",
        slug: "honey",
        hasSub: true,
        subItems: [
            { name: "Sundarban Honey (সুন্দরবনের মধু)", slug: "sundarban-honey" },
            { name: "Litchi Flower Honey (লিচু ফুলের মধু)", slug: "litchi-flower-honey" },
            { name: "Black Seed Honey (কালোজিরা মধু)", slug: "black-seed-honey" },
            { name: "Mixed Flower Honey (মিশ্র ফুলের মধু)", slug: "mixed-flower-honey" },
            { name: "Hill Flower Honey (পাহাড়ি মধু)", slug: "hill-flower-honey" },
            { name: "Cream Honey (ক্রিমহানি)", slug: "cream-honey" }
        ]
    },
    {
        name: "Honey Nut",
        label: "হানিনাট (Honey Nut)",
        slug: "honey-nut",
        hasSub: false
    },
    {
        name: "Oil & Ghee",
        label: "তেল ও ঘি (Oil & Ghee)",
        slug: "oil-ghee",
        hasSub: true,
        subItems: [
            { name: "Mustard Oil (সরিষার তেল)", slug: "mustard-oil" },
            { name: "Coconut Oil (নারিকেল তেল)", slug: "coconut-oil" },
            { name: "Gawa Ghee (গাওয়া ঘি)", slug: "gawa-ghee" },
            { name: "Sorer Ghee (সরের ঘি)", slug: "sorer-ghee" },
            { name: "Black Seed Oil (কালোজিরা তেল)", slug: "black-seed-oil" },
            { name: "Olive Oil (অলিভ অয়েল)", slug: "olive-oil" },
            { name: "Sesame Oil (তিলের তেল)", slug: "sesame-oil" }
        ]
    },
    {
        name: "Dates",
        label: "খেজুর (Dates)",
        slug: "dates",
        hasSub: true,
        subItems: [
            { name: "Ajwa Dates (আজওয়া খেজুর)", slug: "ajwa-dates" },
            { name: "Mariyam Dates (মরিয়ম খেজুর)", slug: "mariyam-dates" },
            { name: "Medjool Dates (মেডজুল খেজুর)", slug: "medjool-dates" },
            { name: "Sukkari Dates (সুক্কারি খেজুর)", slug: "sukkari-dates" },
            { name: "Dabbas Dates (দাব্বাস খেজুর)", slug: "dabbas-dates" },
            { name: "Burni Dates (বারনি খেজুর)", slug: "burni-dates" }
        ]
    },
    {
        name: "Spices",
        label: "মশলা (Spices)",
        slug: "spices",
        hasSub: true,
        subItems: [
            { name: "Turmeric Powder (হলুদ গুঁড়া)", slug: "turmeric-powder" },
            { name: "Chili Powder (মরিচ গুঁড়া)", slug: "chili-powder" },
            { name: "Coriander Powder (ধনিয়া গুঁড়া)", slug: "coriander-powder" },
            { name: "Cumin Powder (জিরা গুঁড়া)", slug: "cumin-powder" },
            { name: "Spice Combo (মশলা কম্বো)", slug: "spice-combo" }
        ]
    },
    {
        name: "Nuts & Seeds",
        label: "বাদাম ও বীজ (Nuts & Seeds)",
        slug: "nuts-seeds",
        hasSub: true,
        subItems: [
            { name: "Almonds (কাঠ বাদাম)", slug: "almonds" },
            { name: "Cashews (কাজু বাদাম)", slug: "cashews" },
            { name: "Chia Seeds (চিয়া সিড)", slug: "chia-seeds" },
            { name: "Pumpkin Seeds (কুমড়া বীজ)", slug: "pumpkin-seeds" },
            { name: "Sunflower Seeds (সূর্যমুখী বীজ)", slug: "sunflower-seeds" },
            { name: "Black Garlic (ব্লাক গার্লিক)", slug: "black-garlic" }
        ]
    },
    {
        name: "Sugar & Jaggery",
        label: "চিনি ও গুড় (Sugar & Jaggery)",
        slug: "sugar-jaggery",
        hasSub: true,
        subItems: [
            { name: "Cane Sugar (আখের চিনি)", slug: "cane-sugar" },
            { name: "Cane Jaggery (আখের গুড়)", slug: "cane-jaggery" },
            { name: "Date Jaggery (খেজুরের গুড়)", slug: "date-jaggery" }
        ]
    },
    {
        name: "Pink Salt",
        label: "পিংক সল্ট (Pink Salt)",
        slug: "pink-salt",
        hasSub: false
    },
    {
        name: "Beverage & Dairy",
        label: "পানীয় ও দুগ্ধ (Beverage & Dairy)",
        slug: "beverage-dairy",
        hasSub: true,
        subItems: [
            { name: "Tang (ট্যাং)", slug: "tang" },
            { name: "Foster Clarks (ফস্টার ক্লার্কস)", slug: "foster-clarks" },
            { name: "Milk Powder (গুঁড়ো দুধ)", slug: "milk-powder" }
        ]
    },
    {
        name: "Snacks",
        label: "নাস্তা ও সেমাই (Snacks)",
        slug: "snacks",
        hasSub: true,
        subItems: [
            { name: "Lachha Semai (লাচ্ছা সেমাই)", slug: "lachha-semai" }
        ]
    }
];

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [expandedMobileCat, setExpandedMobileCat] = useState(null);

    // Consume global cart state
    const { 
        cartItems, 
        cartCount, 
        cartTotal, 
        updateQuantity, 
        removeFromCart, 
        isLoaded,
        isCartOpen,
        setIsCartOpen 
    } = useCart();

    const toggleMobileSub = (index) => {
        setExpandedMobileCat(expandedMobileCat === index ? null : index);
    };

    const handleCategoryClick = (slug) => {
        setIsDrawerOpen(false);
        // Navigation will be handled by Link component
    };

    const handleSubCategoryClick = (categorySlug, subItemSlug) => {
        setIsDrawerOpen(false);
        // You can navigate to subcategory page or filter products
        // window.location.href = `/${categorySlug}?sub=${subItemSlug}`;
    };

    return (
        <>
            <header className="w-full font-sans shadow-sm relative bg-white">
                {/* Universal Overlay */}
                {(isDrawerOpen || isCartOpen) && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => {
                            setIsDrawerOpen(false);
                            setIsCartOpen(false);
                        }}
                    />
                )}

                {/* Left Side Drawer (Mobile) */}
                <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-[#04211c] p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsDrawerOpen(false)}>
                                <div className="w-10 h-10 border-2 border-[#f39200] rounded-lg flex items-center justify-center p-1 bg-white">
                                    <ShoppingBag size={20} className="text-[#f39200]" />
                                </div>
                                <span className="text-white font-black text-lg tracking-tight">Amar Organic Shop</span>
                            </Link>
                            <X className="text-white cursor-pointer" onClick={() => setIsDrawerOpen(false)} />
                        </div>
                        <Link href="/account" className="flex items-center gap-3" onClick={() => setIsDrawerOpen(false)}>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <User className="text-white w-5 h-5" />
                            </div>
                            <div className="text-white">
                                <p className="text-xs text-gray-300">Welcome User!</p>
                                <p className="text-sm font-bold">Login / Register</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="p-4">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Shop Categories</h3>
                            <div className="space-y-1">
                                {categories.map((cat, index) => (
                                    <div key={index} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                        {cat.hasSub ? (
                                            <>
                                                <div
                                                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-orange-50 transition-colors"
                                                    onClick={() => toggleMobileSub(index)}
                                                >
                                                    <span className="text-[14px] text-gray-700 font-semibold">{cat.label}</span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-gray-400 transition-transform duration-300 ${expandedMobileCat === index ? 'rotate-180 text-[#f39200]' : ''}`}
                                                    />
                                                </div>

                                                {/* Mobile Sub Items Accordion */}
                                                {expandedMobileCat === index && (
                                                    <div className="bg-gray-50 border-t border-gray-100 py-1 animate-in slide-in-from-top-2 duration-300">
                                                        {cat.subItems.map((sub, sIdx) => (
                                                            <Link
                                                                key={sIdx}
                                                                href={`/${cat.slug}?sub=${encodeURIComponent(sub.slug)}`}
                                                                className="px-6 py-2.5 text-[13px] text-gray-600 hover:text-[#f39200] flex items-center gap-2 border-l-2 border-transparent hover:border-[#f39200] hover:bg-white"
                                                                onClick={() => setIsDrawerOpen(false)}
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                href={`/${cat.slug}`}
                                                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-orange-50 transition-colors"
                                                onClick={() => setIsDrawerOpen(false)}
                                            >
                                                <span className="text-[14px] text-gray-700 font-semibold">{cat.label}</span>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/track-order" className="bg-white p-3 rounded-lg border border-gray-100 flex flex-col items-center gap-1" onClick={() => setIsDrawerOpen(false)}>
                                    <MapPin size={18} className="text-[#f39200]" />
                                    <span className="text-[10px] font-bold">Track</span>
                                </Link>
                                <Link href="/wishlist" className="bg-white p-3 rounded-lg border border-gray-100 flex flex-col items-center gap-1" onClick={() => setIsDrawerOpen(false)}>
                                    <Heart size={18} className="text-[#f39200]" />
                                    <span className="text-[10px] font-bold">Wishlist</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Cart Drawer */}
                <div className={`fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#04211c]">
                        <div className="flex items-center gap-2 text-white">
                            <ShoppingBag className="text-[#f39200]" size={20} />
                            <span className="font-bold">Your Basket ({cartCount})</span>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} className="text-white" />
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <ShoppingCart size={40} className="text-gray-200" />
                            </div>
                            <p className="text-gray-800 font-bold">Your cart is empty</p>
                            <p className="text-sm text-gray-400 mt-1">Looks like you haven't added anything yet.</p>
                            <button className="mt-6 px-6 py-2 bg-[#f39200] text-white rounded-full font-bold text-sm" onClick={() => setIsCartOpen(false)}>Start Shopping</button>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto w-full p-4 bg-gray-50 flex flex-col gap-3">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 relative shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                                        <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-full h-full object-contain p-2" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight pr-5">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{item.unit}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[#f39200] font-black text-sm">৳{item.price}</span>
                                            
                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded text-gray-600 hover:text-[#f39200]">
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded text-gray-600 hover:text-[#f39200]">
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="p-5 border-t border-gray-100 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400 font-medium text-sm">Subtotal:</span>
                                <span className="text-xl font-bold text-[#04211c]">৳ {cartTotal.toLocaleString()}</span>
                            </div>
                            <Link href="/checkout" className="w-full bg-[#f39200] hover:bg-[#d88200] text-white py-3.5 flex items-center justify-center rounded-xl font-bold transition-all shadow-lg shadow-orange-100" onClick={() => setIsCartOpen(false)}>
                                Proceed to Checkout
                            </Link>
                        </div>
                    )}
                </div>

                {/* Main Header Bar */}
                <div className="bg-[#fcfcfc] border-b border-gray-100 py-3 md:py-5 px-4 md:px-8">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsDrawerOpen(true)}>
                                <Menu className="w-6 h-6 text-[#1a2b3c]" />
                            </button>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-[#f39200] rounded-xl flex items-center justify-center p-1.5 shrink-0 bg-white shadow-sm">
                                    <ShoppingBag className="text-[#f39200] w-full h-full" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-[#04211c] font-black text-base md:text-xl tracking-tighter uppercase">Amar Organic</span>
                                    <span className="text-[#f39200] font-black text-base md:text-xl tracking-tighter uppercase -mt-1">Shop</span>
                                </div>
                            </Link>
                        </div>

                        {/* Search Desktop */}
                        <div className="hidden md:block flex-1 max-w-2xl relative px-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search for honey, dates, ghee..."
                                    className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-6 pr-12 focus:outline-none focus:border-[#f39200] focus:ring-4 focus:ring-orange-50 text-gray-600 text-sm transition-all"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f39200] p-1.5 rounded-full cursor-pointer hover:bg-[#d88200] transition-colors">
                                    <Search className="text-white w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-6 shrink-0">
                            <Link href="/track-order" className="hidden lg:flex flex-col items-center cursor-pointer group text-center px-2">
                                <MapPin className="w-5 h-5 text-[#1a2b3c] group-hover:text-[#f39200] transition-colors" />
                                <span className="text-[10px] font-bold text-[#1a2b3c] mt-1">Track</span>
                            </Link>
                            <Link href="/account" className="hidden sm:flex flex-col items-center cursor-pointer group text-center px-2">
                                <User className="w-5 h-5 text-[#1a2b3c] group-hover:text-[#f39200] transition-colors" />
                                <span className="text-[10px] font-bold text-[#1a2b3c] mt-1">Sign In</span>
                            </Link>
                            <div className="flex flex-col items-center cursor-pointer group relative text-center px-2" onClick={() => setIsCartOpen(true)}>
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6 text-[#1a2b3c] group-hover:text-[#f39200] transition-colors" />
                                    <span className="absolute -top-2 -right-2 bg-[#f39200] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                </div>
                                <span className="hidden sm:block text-[10px] font-bold text-[#1a2b3c] mt-1">Cart</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Mobile */}
                    <div className="md:hidden mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 pr-10 focus:outline-none text-sm text-gray-600"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Desktop Navigation */}
            <StickyNavWrapper>
                <nav className="hidden md:block bg-[#04211c] w-full text-white relative z-50">
                    <div className="max-w-[1400px] mx-auto px-8">
                        <ul className="flex items-center justify-center lg:justify-start gap-1 lg:gap-8 text-[13px] font-bold h-12">
                            {categories.map((cat, i) => (
                                <li
                                    key={i}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(i)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={`/${cat.slug}`}
                                        className={`flex items-center gap-1.5 cursor-pointer h-full px-1 border-b-2 border-transparent transition-all hover:text-[#f39200] ${activeDropdown === i ? 'text-[#f39200] border-[#f39200]' : ''}`}
                                    >
                                        {cat.name}
                                        {cat.hasSub && <ChevronDown size={14} className={`opacity-60 transition-transform ${activeDropdown === i ? 'rotate-180' : ''}`} />}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {cat.hasSub && activeDropdown === i && (
                                        <div className="absolute top-[100%] left-0 bg-white text-gray-800 shadow-2xl border-t-4 border-[#f39200] py-3 min-w-[220px] z-[100] rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                            {cat.subItems.map((sub, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    href={`/${cat.slug}?sub=${encodeURIComponent(sub.slug)}`}
                                                    className="px-5 py-3 hover:bg-orange-50 hover:text-[#f39200] text-[13.5px] font-semibold cursor-pointer transition-all flex items-center justify-between group/item"
                                                >
                                                    {sub.name}
                                                    <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[#f39200]" />
                                                </Link>
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