"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { ChevronLeft, Truck, CheckCircle2, ShieldCheck, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const router = useRouter();
    const { cartItems, cartTotal, clearCart, isLoaded } = useCart();
    
    // Form States
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        address: '',
        note: ''
    });
    const [deliveryZone, setDeliveryZone] = useState('dhaka');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null); // stores orderId instead of boolean

    // Delivery charges
    const deliveryCharges = {
        dhaka: 60,
        sub_dhaka: 70,
        outside: 100
    };

    const deliveryCost = deliveryCharges[deliveryZone];
    const finalTotal = cartTotal + deliveryCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            toast.error("Your cart is empty. Please add items to checkout.");
            router.push('/');
            return;
        }

        setIsSubmitting(true);

        const orderPayload = {
            ...formData,
            deliveryZone,
            items: cartItems.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                image: i.image
            })),
            subTotal: cartTotal,
            deliveryCost,
            finalTotal
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                const data = await res.json();
                toast.success('Order placed successfully!');
                setOrderSuccess(data.orderId); // Setup the actual Tracking ID!
                clearCart();
            } else {
                toast.error('Failed to place order. Please try again or contact support.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Check your network.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (orderSuccess) {
            navigator.clipboard.writeText(orderSuccess);
            toast.success("Tracking ID copied to clipboard!");
        }
    };

    // If completely empty and loaded, show empty state immediately
    if (isLoaded && cartItems.length === 0 && !orderSuccess) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/" className="inline-block w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary hover:brightness-95 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center max-w-lg w-full animate-in zoom-in duration-500">
                    <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-800 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        Thank you for your order, <strong>{formData.name}</strong>. We'll contact you soon at <strong>{formData.mobile}</strong> to confirm your delivery details.
                    </p>

                    {/* NEW: Tracking ID Highlight Block */}
                    <div className="mb-8 p-6 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <p className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-widest">Your Tracking ID</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl md:text-3xl font-black text-[#1a2b3c] tracking-tight bg-white px-4 py-2 rounded-lg shadow-sm">
                                {orderSuccess}
                            </span>
                            <button 
                                onClick={copyToClipboard}
                                className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors active:scale-95"
                                title="Copy ID"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">Save this ID to track your parcel's live status later.</p>
                    </div>
                    
                    <div className="bg-secondary/10 p-4 rounded-xl text-left mb-8 flex items-start gap-3 border border-orange-100">
                        <ShieldCheck className="text-secondary shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Prepare Cash Amount</h4>
                            <p className="text-secondary font-black text-xl">৳ {finalTotal.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Please keep this amount ready for cash on delivery.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link href={`/track-order?id=${orderSuccess}`} className="w-full bg-white border-2 border-secondary text-secondary py-4 rounded-xl font-bold hover:bg-secondary/10 transition-colors shadow-sm">
                            Track Order Now
                        </Link>
                        <Link href="/" className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary hover:brightness-95 transition-colors shadow-lg shadow-orange-200">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">
                {/* Header Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-secondary font-medium mb-6 transition-colors">
                    <ChevronLeft size={20} /> Back to Shopping
                </Link>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column - Checkout Form */}
                    <div className="w-full lg:w-3/5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold">1</div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-800">Billing & Delivery Details</h2>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-5">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required 
                                            placeholder="আপনার পুরো নাম লিখুন" 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <input 
                                            type="tel" 
                                            name="mobile" 
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            required 
                                            placeholder="আপনার মোবাইল নম্বর লিখুন" 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Delivery Area <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {/* Dhaka Inside */}
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${deliveryZone === 'dhaka' ? 'border-secondary bg-secondary/10 ring-1 ring-secondary' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                            <input 
                                                type="radio" 
                                                name="deliveryZone" 
                                                value="dhaka" 
                                                checked={deliveryZone === 'dhaka'} 
                                                onChange={() => setDeliveryZone('dhaka')} 
                                                className="sr-only" 
                                            />
                                            <span className="font-bold text-sm text-gray-800">Inside Dhaka</span>
                                            <span className="text-xs text-secondary font-black mt-1">৳ 60</span>
                                        </label>
                                        
                                        {/* Sub Dhaka */}
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${deliveryZone === 'sub_dhaka' ? 'border-secondary bg-secondary/10 ring-1 ring-secondary' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                            <input 
                                                type="radio" 
                                                name="deliveryZone" 
                                                value="sub_dhaka" 
                                                checked={deliveryZone === 'sub_dhaka'} 
                                                onChange={() => setDeliveryZone('sub_dhaka')} 
                                                className="sr-only" 
                                            />
                                            <span className="font-bold text-sm text-gray-800">Sub-side Dhaka</span>
                                            <span className="text-xs text-secondary font-black mt-1">৳ 70</span>
                                        </label>
                                        
                                        {/* Outside Dhaka */}
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${deliveryZone === 'outside' ? 'border-secondary bg-secondary/10 ring-1 ring-secondary' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                            <input 
                                                type="radio" 
                                                name="deliveryZone" 
                                                value="outside" 
                                                checked={deliveryZone === 'outside'} 
                                                onChange={() => setDeliveryZone('outside')} 
                                                className="sr-only" 
                                            />
                                            <span className="font-bold text-sm text-gray-800">Outside Dhaka</span>
                                            <span className="text-xs text-secondary font-black mt-1">৳ 100</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 pt-2">Full Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-3 pointer-events-none text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <textarea 
                                            name="address" 
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required 
                                            rows="3"
                                            placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন (বাসা/ফ্ল্যাট, রোড নম্বর, এলাকা)" 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 pt-2">Order Note <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                                    <textarea 
                                        name="note" 
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="আপনার অর্ডারের জন্য কোনো বিশেষ নির্দেশনা থাকলে লিখুন..." 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none text-sm"
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-2/5 p-6 md:p-8 bg-white border-2 border-[#1a2b3c] rounded-2xl shadow-xl sticky top-[100px]">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-[#1a2b3c] flex items-center justify-center text-white font-bold">2</div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-800">Order Summary</h2>
                        </div>

                        {/* Cart Items */}
                        <div className="mb-6 max-h-[300px] overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                    <div className="w-14 h-14 bg-white rounded flex items-center justify-center shrink-0 border border-gray-200">
                                        <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="max-w-full max-h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.quantity} × ৳{item.price}</p>
                                    </div>
                                    <div className="font-black text-secondary text-sm whitespace-nowrap px-1">
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Calculations */}
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Subtotal</span>
                                <span>৳ {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Delivery Charge</span>
                                <span>৳ {deliveryCost}</span>
                            </div>
                            
                            <div className="border-t border-gray-200 my-3"></div>
                            
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-lg">Total</span>
                                <span className="text-2xl font-black text-[#1a2b3c]">৳ {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Method Note */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
                            <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 leading-none mb-1">Cash on Delivery</h4>
                                <p className="text-xs text-blue-700">Pay with cash upon delivery.</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            form="checkout-form"
                            disabled={isSubmitting || cartItems.length === 0}
                            className={`w-full py-4 text-white text-base lg:text-lg font-black rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#1a2b3c] hover:bg-black hover:shadow-gray-400/50'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Confirm Order 🚀'
                            )}
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                            By placing your order, you agree to our Terms & Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
