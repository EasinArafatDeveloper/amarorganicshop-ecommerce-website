'use client';
import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, getProductsByCategory } from '@/lib/data/productsData';
import { ShoppingCart, Heart, Share2, Check, Truck, RefreshCw, Shield, Minus, Plus, Star, Phone, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

const ProductDetailPage = () => {
    const params = useParams();
    const slug = params.slug;
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    // Company contact number
    const phoneNumber = "+8801645368899"; // Replace with real
    const whatsappNumber = "8801645368899"; // Without + for WhatsApp API

    useEffect(() => {
        // Get product by slug
        const productData = getProductBySlug(slug);

        if (!productData) {
            notFound();
            return;
        }

        setProduct(productData);

        // Get related products from same category
        const related = getProductsByCategory(productData.category)
            .filter(p => p.id !== productData.id)
            .slice(0, 4);
        setRelatedProducts(related);

        setLoading(false);
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
            addToCart(product, quantity);
        }
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (product && product.inStock) {
            console.log('Buy now:', { ...product, quantity });
            alert(`Proceed to checkout for ${product.name}`);
        }
    };

    // Handle call
    const handleCall = () => {
        window.location.href = `tel:${phoneNumber}`;
    };

    // Handle WhatsApp
    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Hello, I'm interested in ${product?.name}. Price: ৳${product?.price}. Can you please provide more information?`);
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

    // Calculate discount percentage
    const discountPercentage = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Product images array (you can add multiple images)
    const productImages = [
        product.image,
        product.image, // Add more images as needed
        product.image,
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-6 md:py-10 px-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs md:text-sm mb-6 bg-white p-3 md:px-5 rounded-lg shadow-sm border border-gray-100">
                    <Link href="/" className="text-gray-500 hover:text-[#f39200] flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Home
                    </Link>
                    <span className="text-gray-400">›</span>
                    <Link href={`/${product.category}`} className="text-gray-500 hover:text-[#f39200] capitalize">
                        {product.category}
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-[#f39200] font-medium truncate max-w-[200px]">{product.name}</span>
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
                                            className={`w-16 h-16 sm:w-20 sm:h-20 relative bg-[#fafafa] rounded-xl overflow-hidden border-2 transition-all p-2 flex items-center justify-center ${selectedImage === idx ? 'border-[#f39200]' : 'border-gray-200 hover:border-orange-300'
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
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
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
                            {product.rating && (
                                <div className="flex items-center gap-3 mb-6 bg-gray-50 w-fit px-3 py-1.5 rounded-full">
                                    <div className="flex items-center gap-0.5">
                                        {renderRating(product.rating)}
                                    </div>
                                    <div className="h-4 w-px bg-gray-300"></div>
                                    <span className="text-sm font-medium text-[#1a2b3c]">
                                        {product.rating}
                                    </span>
                                    <Link href="#reviews" onClick={() => setActiveTab('reviews')} className="text-sm text-gray-500 hover:text-[#f39200] underline-offset-2 hover:underline">
                                        ({product.reviewCount || 0} customer reviews)
                                    </Link>
                                </div>
                            )}

                            {/* Price */}
                            <div className="mb-6 p-4 bg-orange-50/50 border border-orange-100 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f39200]/5 rounded-bl-full -z-10"></div>
                                <div className="flex items-end gap-3 mb-1">
                                    <span className="text-4xl md:text-5xl font-black text-[#f39200] tracking-tight">
                                        ৳{product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-gray-400 line-through text-xl font-medium mb-1">
                                            ৳{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    {product.unit && (
                                        <span className="text-sm font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                            Per {product.unit}
                                        </span>
                                    )}
                                    {product.originalPrice && product.price && (
                                        <span className="text-green-600 text-sm font-bold bg-green-100 px-3 py-1 rounded-full animate-pulse shadow-sm border border-green-200">
                                            Save ৳{(product.originalPrice - product.price).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.inStock ? (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 w-fit">
                                        <Check size={18} className="text-green-600" />
                                        <span className="font-semibold">In Stock</span>
                                        <div className="h-4 w-px bg-green-200 mx-1"></div>
                                        <span className="text-sm">Ready to dispatch</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 w-fit">
                                        <span className="font-semibold text-lg">✗</span>
                                        <span className="font-semibold">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Description Short */}
                            {product.description && (
                                <p className="text-gray-600 text-base mb-8 leading-relaxed border-l-4 border-[#f39200] pl-4 bg-gray-50 py-2 rounded-r-lg">
                                    {product.description}
                                </p>
                            )}

                            {/* Quantity & Actions Wrapper */}
                            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                    {/* Quantity Selector */}
                                    {product.inStock && (
                                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200 w-[140px] shrink-0">
                                            <button
                                                onClick={decreaseQuantity}
                                                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:text-[#f39200] hover:shadow-sm transition-all border border-transparent hover:border-gray-200 active:scale-95"
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
                                                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:text-[#f39200] hover:shadow-sm transition-all border border-transparent hover:border-gray-200 active:scale-95"
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
                                                ? 'bg-orange-50 border-2 border-[#f39200] text-[#f39200] hover:bg-[#f39200] hover:text-white shadow-sm active:scale-[0.98]'
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
                                                ? 'bg-[#f39200] text-white hover:bg-[#e08600] active:scale-[0.98] hover:shadow-lg'
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

                                {/* Call & WhatsApp Contact */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={handleCall}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm active:scale-95"
                                    >
                                        <Phone size={16} />
                                        <span>কল করুন</span>
                                    </button>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all bg-[#25D366] text-white hover:bg-[#20b859] shadow-sm active:scale-95"
                                    >
                                        <MessageCircle size={16} />
                                        <span>WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Banner */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-100 bg-gray-50/50 divide-x divide-y lg:divide-y-0 divide-gray-100">
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Truck size={24} className="text-[#f39200]" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Free Delivery</h4>
                                <p className="text-xs text-gray-500">For orders over ৳1000</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <RefreshCw size={24} className="text-[#f39200]" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Easy Returns</h4>
                                <p className="text-xs text-gray-500">7 Days return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Shield size={24} className="text-[#f39200]" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Secure Payment</h4>
                                <p className="text-xs text-gray-500">100% Secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4">
                            <Check size={24} className="text-[#f39200]" />
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
                                ? 'text-[#f39200] border-b-2 border-[#f39200] bg-orange-50/30'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                            বিবরণ (Description)
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`px-6 py-4 text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'specifications'
                                ? 'text-[#f39200] border-b-2 border-[#f39200] bg-orange-50/30'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            স্পেসিফিকেশন (Specifications)
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-4 text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'reviews'
                                ? 'text-[#f39200] border-b-2 border-[#f39200] bg-orange-50/30'
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
                                <p className="leading-relaxed mb-6">
                                    {product.description || "কোন বিবরণ পাওয়া যায়নি।"}
                                </p>
                                
                                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                                    <h3 className="text-xl font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                                        <Star size={20} className="text-[#f39200]" /> মূল বৈশিষ্ট্যসমূহ:
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
                                <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <div className="text-6xl mb-4 opacity-80">💬</div>
                                    <h3 className="text-2xl font-bold text-[#1a2b3c] mb-2">কোন রিভিউ নেই</h3>
                                    <p className="text-gray-500 mb-6 text-lg">এই পণ্যটির প্রথম রিভিউ দিন এবং অন্যদের সাহায্য করুন।</p>
                                    <button className="px-8 py-3 bg-[#f39200] text-white font-bold rounded-xl shadow-md hover:bg-[#e08600] active:scale-95 transition-all">
                                        রিভিউ লিখুন
                                    </button>
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
                                সম্পর্কিত পণ্য <span className="text-[#f39200]"> (Related Products)</span>
                            </h2>
                            <Link href={`/${product.category}`} className="text-sm font-bold text-[#f39200] hover:text-[#e08600] flex items-center gap-1 group">
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
                                            <div className="absolute top-2 right-2 bg-[#f39200] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                {p.badge}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-sm md:text-base font-bold text-[#1a2b3c] line-clamp-2 mb-2 group-hover:text-[#f39200] transition-colors leading-tight">
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
                                                <span className="flex items-center gap-1 text-[#f39200] font-black text-lg">
                                                    <span className="text-sm">৳</span>{p.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <button className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#f39200] group-hover:bg-[#f39200] group-hover:text-white transition-colors">
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
