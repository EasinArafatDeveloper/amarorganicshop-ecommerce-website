'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Loader2, SlidersHorizontal, ArrowUpDown, Filter, X, Check } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

const CategoryPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug;
    const initialSubSlug = searchParams.get('sub');
    const { addToCart } = useCart();
    const router = useRouter();

    const [allCatProducts, setAllCatProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering states
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubSlug || 'all');
    const [sortOption, setSortOption] = useState('default');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const allData = await res.json();
                
                // Fetch all products exactly matching the category slug
                const catProducts = allData.filter(p => p.category === slug);
                setAllCatProducts(catProducts);

            } catch (error) {
                console.error("Error fetching", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        addToCart(product, 1, false);
        router.push('/checkout');
    };

    // Extract unique Sub-Categories from the current category's products
    const uniqueSubCategories = useMemo(() => {
        const subs = new Set();
        allCatProducts.forEach(p => {
            if (p.subCategory) {
                subs.add(p.subCategory);
            }
        });
        return Array.from(subs).map(sub => ({
            id: sub.toLowerCase().replace(/\s+/g, '-'),
            name: sub
        }));
    }, [allCatProducts]);

    // Apply Client-Side Filters and Sorts dynamically without refetching!
    const displayedProducts = useMemo(() => {
        let filtered = [...allCatProducts];

        // 1. Sub-Category Filter
        if (selectedSubCategory !== 'all') {
            filtered = filtered.filter(p => {
                const pSub = p.subCategory ? p.subCategory.toLowerCase().replace(/\s+/g, '-') : null;
                return pSub === selectedSubCategory || p.slug === selectedSubCategory; // Match param subSlug edgecase
            });
        }

        // 2. In Stock Filter
        if (inStockOnly) {
            filtered = filtered.filter(p => p.inStock === true);
        }

        // 3. Sorting
        if (sortOption === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name-a') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [allCatProducts, selectedSubCategory, sortOption, inStockOnly]);


    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-secondary">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-[#1a2b3c] font-semibold animate-pulse">Loading category products...</p>
            </div>
        );
    }

    const titleFormat = slug ? slug.replace(/-/g, ' ') : 'Category';

    return (
        <section className="w-full bg-[#fdfbf7]/30 py-8 px-4 md:px-8 min-h-[70vh]">
            <div className="max-w-[1400px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs md:text-sm mb-6 bg-white p-3 md:px-5 rounded-lg shadow-sm border border-gray-100">
                    <Link href="/" className="text-gray-500 hover:text-secondary flex items-center gap-1">
                        Home
                    </Link>
                    <span className="text-gray-400">›</span>
                    <Link href="/shop" className="text-gray-500 hover:text-secondary">Shop</Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-secondary capitalize font-medium">{titleFormat}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- MOBILE FILTER TOGGLE BAR --- */}
                    <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 text-gray-700 font-bold hover:text-secondary transition-colors"
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

                    {/* --- LEFT SIDEBAR (FILTERS) --- */}
                    <div className={`fixed inset-0 z-[100] lg:static lg:block lg:w-1/4 lg:z-auto transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        {/* Overlay backdrop for mobile */}
                        {isMobileFilterOpen && (
                            <div 
                                className="absolute inset-0 bg-black/60 lg:hidden"
                                onClick={() => setIsMobileFilterOpen(false)}
                            />
                        )}
                        
                        <div className="absolute top-0 left-0 h-full w-[280px] bg-white lg:bg-transparent lg:static lg:h-auto lg:w-full p-6 lg:p-0 overflow-y-auto lg:overflow-visible">
                            {/* Mobile Drawer Header */}
                            <div className="flex justify-between items-center lg:hidden mb-6">
                                <h3 className="font-black text-xl text-gray-800">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-white lg:border lg:border-gray-200 rounded-2xl lg:p-6 lg:shadow-sm space-y-8">
                                
                                {/* Sub-Category Filter */}
                                {uniqueSubCategories.length > 0 && (
                                    <div>
                                        <h3 className="font-black text-lg text-gray-800 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                                            <Filter size={18} className="text-secondary" />
                                            Sub-Categories
                                        </h3>
                                        <div className="space-y-2">
                                            <button 
                                                onClick={() => { setSelectedSubCategory('all'); setIsMobileFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedSubCategory === 'all' ? 'bg-secondary/10 text-secondary border-l-4 border-secondary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                            >
                                                All {titleFormat}
                                            </button>
                                            
                                            {uniqueSubCategories.map(cat => (
                                                <button 
                                                    key={cat.id}
                                                    onClick={() => { setSelectedSubCategory(cat.id); setIsMobileFilterOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedSubCategory === cat.id ? 'bg-secondary/10 text-secondary border-l-4 border-secondary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent capitalize'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stock Filter */}
                                <div>
                                    <h3 className="font-black text-lg text-gray-800 mb-4 pb-4 border-b border-gray-100">
                                        Availability
                                    </h3>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-secondary border-secondary' : 'border-gray-300 group-hover:border-secondary'}`}>
                                            {inStockOnly && <Check size={14} className="text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={inStockOnly}
                                            onChange={() => {
                                                setInStockOnly(!inStockOnly);
                                                setIsMobileFilterOpen(false);
                                            }}
                                        />
                                        <span className="text-sm font-semibold text-gray-700 select-none group-hover:text-gray-900">In Stock Exclusively</span>
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* --- MAIN PRODUCT GRID --- */}
                    <div className="w-full lg:w-3/4">
                        
                        {/* Desktop Header Utility */}
                        <div className="hidden lg:flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                            <h1 className="text-[#1a2b3c] text-xl font-black capitalize flex items-center gap-2">
                                {selectedSubCategory !== 'all' ? selectedSubCategory.replace(/-/g, ' ') : titleFormat}
                                <span className="text-gray-400 font-medium text-sm bg-gray-100 px-2 py-0.5 rounded-full">{displayedProducts.length} items</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">Sort by:</span>
                                <div className="relative bg-gray-50 border border-gray-200 rounded-lg pr-4 pl-2 py-1.5 focus-within:border-secondary transition-all">
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

                        {/* Mobile Header */}
                        <div className="lg:hidden mb-4 px-2">
                            <h1 className="text-[#1a2b3c] text-lg font-black capitalize flex items-center gap-2">
                                {selectedSubCategory !== 'all' ? selectedSubCategory.replace(/-/g, ' ') : titleFormat}
                                <span className="text-gray-400 font-medium text-sm">({displayedProducts.length})</span>
                            </h1>
                        </div>

                        {!allCatProducts || allCatProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <h2 className="text-2xl font-bold text-gray-500 mb-2">Empty Category</h2>
                                <p className="text-gray-400 mb-6">We couldn't find any products in this category.</p>
                                <Link href="/" className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary hover:brightness-95 transition-colors">
                                    Return Home
                                </Link>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[40vh]">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Filter size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Matching Products Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your filters, selecting a different sub-category, or disabling "In Stock Exclusively".</p>
                                <button 
                                    onClick={() => { setSelectedSubCategory('all'); setInStockOnly(false); }}
                                    className="mt-6 font-bold text-secondary hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                {displayedProducts.map((product) => (
                                    <Link
                                        href={`/product/${product.slug}`}
                                        key={product.id}
                                        className="group bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-orange-100 relative h-full"
                                    >
                                        {/* Tag/Discount Badge */}
                                        <div className="flex justify-between items-start mb-2 pointer-events-none z-10 relative">
                                            {product.badge ? (
                                                <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                    {product.badge}
                                                </span>
                                            ) : product.isOrganic ? (
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                    Organic
                                                </span>
                                            ) : <div />}
                                            
                                            {product.originalPrice && product.price && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Image */}
                                        <div className="h-32 md:h-44 flex items-center justify-center mb-4 overflow-hidden bg-[#fafafa] rounded-lg relative -mt-6">
                                            <img
                                                src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                                                alt={product.name}
                                                className="max-h-full object-contain p-2 md:p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-col flex-grow">
                                            <h3 className="text-[#1a2b3c] text-xs md:text-sm font-bold mb-1.5 line-clamp-2 min-h-[32px] md:min-h-[40px] group-hover:text-secondary transition-colors">
                                                {product.name}
                                            </h3>

                                            {/* Pricing */}
                                            <div className="flex flex-wrap items-end gap-2 mb-4 mt-auto">
                                                <span className="text-secondary text-base md:text-lg font-black leading-none">৳{product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="text-gray-400 line-through text-xs font-medium leading-none mb-0.5">৳{product.originalPrice}</span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 mt-auto text-xs w-full">
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    disabled={!product.inStock}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-md font-semibold transition-all ${
                                                        product.inStock 
                                                        ? 'border-secondary text-secondary hover:bg-secondary hover:text-white'
                                                        : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                                    }`}
                                                >
                                                    <ShoppingCart size={14} />
                                                    <span className="hidden md:inline">Add</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => handleBuyNow(e, product)}
                                                    disabled={!product.inStock}
                                                    className={`flex-[2] py-2 rounded-md font-semibold text-white shadow-sm text-center transition-colors ${
                                                        product.inStock 
                                                        ? 'bg-secondary hover:bg-secondary hover:brightness-95'
                                                        : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                                                    }`}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryPage;