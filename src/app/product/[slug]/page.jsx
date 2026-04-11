'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, Check, Truck, RefreshCw, Shield, Minus, Plus, Star, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

const ProductDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Company contact number
    const phoneNumber = "+8801645368899"; // Replace with real
    const whatsappNumber = "8801645368899"; // Without + for WhatsApp API

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await fetch('/api/products');
                const allProducts = await res.json();
                
                // Get product by slug
                const productData = allProducts.find(p => p.slug === slug);

                if (!productData) {
                    notFound();
                    return;
                }

                setProduct(productData);
                
                // Initialize default variant
                if (productData.variants && productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                }

                // Get related products from same category
                const related = allProducts
                    .filter(p => p.category === productData.category && p.id !== productData.id)
                    .slice(0, 4);
                setRelatedProducts(related);
            } catch (error) {
                console.error("Error fetching", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [slug]);

    // Handle quantity change
    const increaseQuantity = () => {
        if (product && quantity < (product.inStock ? 10 : 0)) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (product && product.inStock) {
            addToCart(product, quantity, true, selectedVariant);
        }
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (product && product.inStock) {
            addToCart(product, quantity, false, selectedVariant);
            router.push('/checkout');
        }
    };

    // Handle call
    const handleCall = () => {
        window.location.href = `tel:${phoneNumber}`;
    };

    // Handle WhatsApp
    const handleWhatsApp = () => {
        const currentPrice = selectedVariant ? selectedVariant.price : product?.price;
        const message = encodeURIComponent(`Hello, I'm interested in ${product?.name}. Price: ৳${currentPrice}. Can you please provide more information?`);
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    // Render rating stars
    const renderRating = (rating = 0) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={18} />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="fill-yellow-400 text-yellow-400 half-star" size={18} />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-[1400px] mx-auto">
                    <div className="bg-white rounded-lg p-6 animate-pulse">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/2">
                                <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="lg:w-1/2 space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    // Dynamic rendering variables
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
    const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;

    // Calculate price range
    let minPrice = product.price;
    let maxPrice = product.price;

    if (product.variants && product.variants.length > 0) {
        const prices = product.variants.map(v => v.price);
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
    }

    const hasPriceRange = minPrice !== maxPrice;
    
    // Calculate discount percentage
    const discountPercentage = currentOriginalPrice && currentPrice
        ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
        : 0;

    // Product images array (use actual images if available)
    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.image];

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-6 md:py-10 px-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs md:text-sm mb-6 bg-white p-3 md:px-5 rounded-lg shadow-sm border border-gray-100">
                    <Link href="/" className="text-gray-500 hover:text-secondary flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Home
                    </Link>
                    <span className="text-gray-400">›</span>
                    <Link href={`/${product.category}`} className="text-gray-500 hover:text-secondary capitalize">
                        {product.category}
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-secondary font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                {/* Product Main Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="flex flex-col lg:flex-row p-5 md:p-8 gap-8">
                        {/* Left - Product Images */}
                        <div className="lg:w-[45%] flex flex-col items-center">
                            {/* Main Image */}
                            <div className="w-full max-w-[500px] aspect-square relative bg-[#fafafa] rounded-2xl border border-gray-100 mb-4 flex items-center justify-center p-6 group overflow-hidden">
                                <img
                                    src={productImages[selectedImage] || product.image || "https://via.placeholder.com/600x600?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=No+Image"; }}
                                />
                                {/* Discount badge on image */}
                                {discountPercentage > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 animate-pulse">
                                        -{discountPercentage}%
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {productImages.length > 1 && (
                                <div className="flex gap-4 w-full justify-center">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 relative bg-[#fafafa] rounded-xl overflow-hidden border-2 transition-all p-2 flex items-center justify-center ${selectedImage === idx ? 'border-secondary' : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <img
                                                src={img || "https://via.placeholder.com/150x150?text=No+Image"}
                                                alt={`${product.name} ${idx + 1}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/150x150?text=No+Image"; }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right - Product Info */}
                        <div className="lg:w-[55%] flex flex-col">
                            {/* Badges & Categories */}
                            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium uppercase tracking-wider">
                                {product.isOrganic && (
                                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                                        <Check size={12} /> Organic
                                    </span>
                                )}
                                {product.badge && (
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1">
                                        <Star size={12} className="fill-orange-500" /> {product.badge}
                                    </span>
                                )}
                                <span className="text-gray-400 px-2 py-1 bg-gray-50 rounded-full border border-gray-100">{product.category}</span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2b3c] mb-2 leading-tight">
                                {product.name}
                            </h1>
                            {product.nameBn && (
                                <h2 className="text-xl md:text-2xl font-medium text-gray-500 mb-4">
                                    {product.nameBn}
                                </h2>
                            )}

                            {/* Rating */}
                            {product.rating > 0 && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-0.5">
                                        {renderRating(product.rating)}
                                    </div>
                                    <Link href="#reviews" onClick={() => setActiveTab('reviews')} className="text-sm text-gray-500 hover:text-secondary underline-offset-2 hover:underline">
                                        ({product.reviewCount || 0} customer review{product.reviewCount !== 1 ? 's' : ''})
                                    </Link>
                                </div>
                            )}

                            {/* Price Range */}
                            <div className="mb-4">
                                <h3 className="text-2xl font-black text-secondary">
                                    {hasPriceRange ? (
                                        <span>৳{minPrice.toLocaleString()} – ৳{maxPrice.toLocaleString()}</span>
                                    ) : (
                                        <span>৳{product.price.toLocaleString()}</span>
                                    )}
                                </h3>
                            </div>

                            {/* Short Description */}
                            {product.shortDescription && (
                                <div className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                                    <p>{product.shortDescription}</p>
                                </div>
                            )}

                            {/* Variants Selection */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                                        Weight:: <span className="font-normal">{selectedVariant ? selectedVariant.unit : ''}</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-4 py-2 text-sm transition-all border ${
                                                    selectedVariant === variant 
                                                    ? 'border-gray-800 text-gray-800 font-bold' 
                                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                {variant.unit}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedVariant(null)} 
                                        className="text-gray-400 text-xs mt-2 hover:text-gray-600 flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Clear
                                    </button>
                                </div>
                            )}

                            {/* Selected Variant Price */}
                            {selectedVariant && (
                                <div className="mb-4 flex items-center gap-2">
                                    {selectedVariant.originalPrice && (
                                        <span className="text-gray-400 line-through text-lg font-medium">
                                            ৳{selectedVariant.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                    <span className="text-2xl font-black text-secondary">
                                        ৳{selectedVariant.price.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {/* Description Full Output Location (Removed from here, only showing variants and selection) */}

                            {/* Quantity & Actions Wrapper */}
                            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                    {/* Quantity Selector */}
                                    {product.inStock && (
                                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200 w-[140px] shrink-0">
                                            <button
                                                onClick={decreaseQuantity}
                                                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:text-secondary hover:shadow-sm transition-all border border-transparent hover:border-gray-200 active:scale-95"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="text"
                                                value={quantity}
                                                readOnly
                                                className="w-10 text-center font-bold text-lg bg-transparent border-none outline-none text-[#1a2b3c]"
                                            />
                                            <button
                                                onClick={increaseQuantity}
                                                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:text-secondary hover:shadow-sm transition-all border border-transparent hover:border-gray-200 active:scale-95"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Add to Cart & Buy Now Buttons */}
                                    <div className="flex-1 flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all ${product.inStock
                                                ? 'bg-secondary/10 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white shadow-sm active:scale-[0.98]'
                                                : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <ShoppingCart size={20} />
                                            <span className="hidden lg:inline">Add to Cart</span>
                                            <span className="lg:hidden">Cart</span>
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={!product.inStock}
                                            className={`flex-1 py-3 px-2 rounded-xl font-bold text-lg transition-all shadow-md ${product.inStock
                                                ? 'bg-secondary text-white hover:bg-secondary hover:brightness-95 active:scale-[0.98] hover:shadow-lg'
                                                : 'bg-gray-300 text-white cursor-not-allowed'
                                                }`}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                    
                                    {/* Wishlist Button */}
                                    <button className="w-12 h-[52px] border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 shrink-0">
                                        <Heart size={22} className="fill-transparent" />
                                    </button>
                                </div>

                                {/* WhatsApp Contact */}
                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <button
                                        onClick={handleWhatsApp}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all bg-[#25D366] text-white hover:bg-[#20b859] shadow-sm active:scale-95"
                                    >
                                        <MessageCircle size={16} />
                                        <span>Order via WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Banner */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 bg-gray-50/50 divide-x divide-y lg:divide-y-0 divide-gray-100">
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Truck size={24} className="text-secondary" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Free Delivery</h4>
                                <p className="text-xs text-gray-500">For orders over ৳1000</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <RefreshCw size={24} className="text-secondary" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Easy Returns</h4>
                                <p className="text-xs text-gray-500">7 Days return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Shield size={24} className="text-secondary" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Secure Payment</h4>
                                <p className="text-xs text-gray-500">100% Secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Check size={24} className="text-secondary" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Quality Assured</h4>
                                <p className="text-xs text-gray-500">100% Authentic products</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs - Premium Styled */}
                <div id="details" className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-12">
                    <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-4 text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'description'
                                ? 'text-secondary border-b-2 border-secondary bg-secondary/10/30'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                            বিবরণ (Description)
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`px-6 py-4 text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'specifications'
                                ? 'text-secondary border-b-2 border-secondary bg-secondary/10/30'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            স্পেসিফিকেশন (Specifications)
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-4 text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'reviews'
                                ? 'text-secondary border-b-2 border-secondary bg-secondary/10/30'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            রিভিউ ({product.reviewCount || 0})
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-lg max-w-none text-gray-600">
                                <div 
                                    className="leading-relaxed mb-6 space-y-4"
                                    dangerouslySetInnerHTML={{ __html: product.description || "কোন বিবরণ পাওয়া যায়নি।" }}
                                />
                                
                                <div className="bg-secondary/10/50 p-6 rounded-xl border border-orange-100">
                                    <h3 className="text-xl font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                                        <Star size={20} className="text-secondary" /> মূল বৈশিষ্ট্যসমূহ:
                                    </h3>
                                    <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">১০০% খাঁটি ও প্রাকৃতিক</span></li>
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">কোন কৃত্রিম প্রিজারভেটিভ নেই</span></li>
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">সরাসরি কৃষকদের কাছ থেকে সংগ্রহীত</span></li>
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">প্রিমিয়াম কোয়ালিটির পণ্য</span></li>
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">বিএসটিআই অনুমোদিত</span></li>
                                        <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> <span className="font-medium text-gray-700">স্বাস্থ্যসম্মত প্যাকেজিং</span></li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <div className="grid grid-cols-1 divide-y divide-gray-200">
                                    <div className="flex flex-col sm:flex-row bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/3 p-4 text-sm font-semibold text-gray-600 bg-gray-100/50 border-r border-gray-200">পণ্যের নাম</div>
                                        <div className="sm:w-2/3 p-4 text-sm font-medium text-gray-800">{product.name}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/3 p-4 text-sm font-semibold text-gray-600 bg-gray-100/50 border-r border-gray-200">ক্যাটাগরি</div>
                                        <div className="sm:w-2/3 p-4 text-sm font-medium text-gray-800 capitalize">{product.category}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/3 p-4 text-sm font-semibold text-gray-600 bg-gray-100/50 border-r border-gray-200">ওজন/ইউনিট</div>
                                        <div className="sm:w-2/3 p-4 text-sm font-medium text-gray-800">{product.unit || 'Standard'}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/3 p-4 text-sm font-semibold text-gray-600 bg-gray-100/50 border-r border-gray-200">অর্গানিক</div>
                                        <div className="sm:w-2/3 p-4 text-sm font-medium text-gray-800">{product.isOrganic ? 'হ্যাঁ, ১০০% প্রাকৃতিক' : 'না'}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/3 p-4 text-sm font-semibold text-gray-600 bg-gray-100/50 border-r border-gray-200">দেশ/উৎস</div>
                                        <div className="sm:w-2/3 p-4 text-sm font-medium text-gray-800">বাংলাদেশ</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id="reviews" className="scroll-mt-24">
                            {activeTab === 'reviews' && (
                                <div>
                                    {product.reviews && product.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {product.reviews.map((rev, idx) => (
                                                <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-bold text-[#1a2b3c]">{rev.user}</div>
                                                        <div className="text-secondary opacity-90 text-sm">
                                                            {new Date(rev.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {renderRating(rev.rating)}
                                                    </div>
                                                    <p className="text-gray-600 mt-2">{rev.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                            <div className="text-6xl mb-4 opacity-80">💬</div>
                                            <h3 className="text-2xl font-bold text-[#1a2b3c] mb-2">কোন রিভিউ নেই</h3>
                                            <p className="text-gray-500 mb-6 text-lg">এই পণ্যটির প্রথম রিভিউ দিন এবং অন্যদের সাহায্য করুন।</p>
                                            <button className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-md hover:bg-secondary hover:brightness-95 active:scale-95 transition-all">
                                                রিভিউ লিখুন
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 mb-8 relative">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c] tracking-tight">
                                সম্পর্কিত পণ্য <span className="text-secondary"> (Related Products)</span>
                            </h2>
                            <Link href={`/${product.category}`} className="text-sm font-bold text-secondary hover:text-[#e08600] flex items-center gap-1 group">
                                View All <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/product/${p.slug}`}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="w-full aspect-square relative bg-[#fafafa] rounded-xl overflow-hidden mb-4 p-4 border border-gray-50">
                                        <img
                                            src={p.image || "https://via.placeholder.com/300x300?text=No+Image"}
                                            alt={p.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                                        />
                                        {p.badge && (
                                            <div className="absolute top-2 right-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                {p.badge}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-sm md:text-base font-bold text-[#1a2b3c] line-clamp-2 mb-2 group-hover:text-secondary transition-colors leading-tight">
                                            {p.name}
                                        </h3>
                                        {p.unit && (
                                            <span className="text-xs text-gray-400 mb-2">{p.unit}</span>
                                        )}
                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex flex-col">
                                                {p.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">৳{p.originalPrice.toLocaleString()}</span>
                                                )}
                                                <span className="flex items-center gap-1 text-secondary font-black text-lg">
                                                    <span className="text-sm">৳</span>{p.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <button className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                                <ShoppingCart size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}} />
        </div>
    );
};

export default ProductDetailPage;
