"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AllNaturalHoney = ({ customTitle = 'All Natural Honey' }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { addToCart } = useCart();
    const router = useRouter();

    // Dragging state variables
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleBuyNow = (product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            unit: product.unit || '1kg'
        }, 1, false);
        router.push('/checkout');
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoney = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                const honeyItems = data.filter(p => p.category === 'honey').slice(0, 6);
                setProducts(honeyItems);
            } catch(e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchHoney();
    }, []);

    // Mouse Down handler (Dragging start)
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    // Mouse Move handler (Dragging)
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed logic
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Mouse Up handler (Dragging end)
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Dynamic Scroll Handler ngam Pagination Dots
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // Mbaydi hisaabu ngam heɓde index dot on
            // Sibu eden jogii 6 items, so 4 ina njiya e desktop, pagination index wonata 2 walla 3
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) {
                setActiveIndex(0);
                return;
            }

            const percentage = scrollLeft / maxScroll;
            const totalDots = products.length;
            const index = Math.round(percentage * (totalDots - 1));

            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <section className="w-full bg-white py-12 px-4 md:px-8 overflow-hidden">
            <style>
                {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-select {
            user-select: none;
            -webkit-user-drag: none;
          }
        `}
            </style>

            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-end border-b-2 border-gray-100 mb-8 pb-2 relative">
                    <div className="relative">
                        <h2 className="text-xl md:text-3xl font-black text-center text-[#1a2b3c] mb-8 md:mb-10 uppercase tracking-tight font-sans">
                            {customTitle}
                        </h2>
                        <div className="absolute bottom-[-10px] left-0 w-full h-[3px] bg-secondary"></div>
                    </div>
                    <button className="flex items-center gap-1 text-secondary font-bold text-xs md:text-sm underline uppercase tracking-wider transition-all">
                        View All Items <ArrowRight size={16} />
                    </button>
                </div>

                {/* Swiper Container */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 w-full text-secondary">
                        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[#1a2b3c] font-semibold animate-pulse">Loading natural honey...</p>
                    </div>
                ) : (
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-1 ${isDragging ? 'cursor-grabbing active:snap-none' : 'cursor-grab'}`}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[260px] md:min-w-[300px] lg:min-w-[calc(25%-1.25rem)] bg-white border border-gray-100 rounded-xl p-5 flex flex-col snap-start transition-all duration-300 hover:shadow-xl hover:border-secondary/20 group no-select"
                        >
                            {/* Badges */}
                            <div className="flex justify-between items-start h-8 mb-4 pointer-events-none">
                                {product.badge ? (
                                    <span className="bg-secondary text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                                        {product.badge}
                                    </span>
                                ) : <div />}
                            </div>

                            {/* Product Image */}
                            <Link 
                                href={`/product/${product.slug}`} 
                                onClick={(e) => { if(isDragging) e.preventDefault(); }}
                                className="block h-56 flex items-center justify-center mb-6 overflow-hidden"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                                />
                            </Link>

                            {/* Details */}
                            <div className="flex flex-col flex-grow">
                                <Link 
                                    href={`/product/${product.slug}`} 
                                    onClick={(e) => { if(isDragging) e.preventDefault(); }}
                                    className="block"
                                >
                                    <h3 className="text-gray-800 text-sm md:text-base font-bold mb-3 line-clamp-2 min-h-[44px] group-hover:text-secondary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Pricing */}
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-secondary text-xl font-black">৳{product.price.toLocaleString()}</span>
                                    {product.originalPrice && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 line-through text-sm font-medium">৳{product.originalPrice.toLocaleString()}</span>
                                            <div className="bg-red-50 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center shadow-sm border border-red-100">
                                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-auto text-xs w-full">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product, 1);
                                        }}
                                        className="flex-1 border-2 border-secondary text-secondary py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all duration-300 hover:bg-secondary hover:text-white pointer-events-auto"
                                    >
                                        <ShoppingCart size={14} strokeWidth={2.5} />
                                        Add
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuyNow(product);
                                        }}
                                        className="flex-1 bg-secondary text-white py-2.5 rounded-lg font-bold hover:bg-secondary hover:brightness-95 transition-colors shadow-sm pointer-events-auto"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* Dynamic Pagination Dots */}
                <div className="flex justify-center items-center gap-2 mt-10">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (scrollRef.current) {
                                    const { scrollWidth, clientWidth } = scrollRef.current;
                                    const maxScroll = scrollWidth - clientWidth;
                                    const scrollAmount = (i / (products.length - 1)) * maxScroll;
                                    scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                                }
                            }}
                            className={`transition-all duration-300 rounded-full ${activeIndex === i
                                    ? "w-4 h-4 bg-secondary shadow-md scale-110" // Color e mawnugol ngam dot active
                                    : "w-2.5 h-2.5 border-2 border-secondary bg-transparent opacity-40 hover:opacity-100" // Dot inactive
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllNaturalHoney;