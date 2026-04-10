'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ChevronRight, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id') || '';

    const [trackingId, setTrackingId] = useState(initialId);
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [hasAttempted, setHasAttempted] = useState(false);

    // Auto-fetch if tracking ID is passed in URL
    useEffect(() => {
        if (initialId) {
            handleTrack(null, initialId);
        }
    }, [initialId]);

    const handleTrack = async (e, idToTrack = trackingId) => {
        if (e) e.preventDefault();
        
        if (!idToTrack.trim()) {
            toast.error("Please enter a valid Tracking ID");
            return;
        }

        setIsLoading(true);
        setHasAttempted(true);
        
        try {
            const res = await fetch('/api/track-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: idToTrack.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                setOrderData(data.order);
            } else {
                setOrderData(null);
                const errData = await res.json();
                toast.error(errData.error || "Order not found");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
            setOrderData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper map for tracking states
    const statusMap = {
        'Pending': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500', step: 1, label: 'Order Placed' },
        'Processing': { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500', step: 2, label: 'Processing' },
        'Shipped': { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500', step: 3, label: 'Out for Delivery' },
        'Delivered': { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500', step: 4, label: 'Delivered' },
        'Canceled': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500', step: 0, label: 'Canceled' },
    };

    const currentStatus = orderData ? statusMap[orderData.status] || statusMap['Pending'] : null;

    // Formatting date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7]/50 py-10 md:py-16 px-4">
            <div className="max-w-[800px] mx-auto">
                {/* Header block */}
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-white border-2 border-secondary text-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <MapPinTrackIcon />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-3">Track Your Order</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Enter your unique tracking ID provided during checkout to view the live status of your order.
                    </p>
                </div>

                {/* Input block */}
                <form onSubmit={handleTrack} className="mb-10 bg-white p-4 md:p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tracking ID / Order Number</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="text-gray-400 w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="e.g. ORD-1234-5678"
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-gray-400 font-medium font-mono text-gray-800 transition-all uppercase"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !trackingId.trim()}
                            className={`sm:w-[150px] py-3.5 px-6 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                                isLoading || !trackingId.trim() ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-secondary hover:bg-secondary hover:brightness-95 active:scale-95 hover:shadow-orange-200'
                            }`}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Now'}
                        </button>
                    </div>
                </form>

                {/* Output UI Box */}
                <div className="min-h-[300px]">
                    {isLoading ? (
                        <div className="h-[300px] flex flex-col items-center justify-center animate-pulse bg-white rounded-2xl border border-gray-100">
                            <Truck className="w-12 h-12 text-secondary mb-4 absolute" />
                            <div className="w-24 h-24 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
                            <p className="mt-4 font-bold text-gray-400 text-sm">Searching Database...</p>
                        </div>
                    ) : orderData ? (
                        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 fade-in">
                            {/* Summary Header */}
                            <div className="bg-[#1a2b3c] p-6 text-white relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Order Details</p>
                                        <h2 className="text-2xl font-black font-mono tracking-tight mb-2">{orderData.orderId}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                                            <Clock size={14} />
                                            {formatDate(orderData.createdAt)}
                                        </div>
                                    </div>
                                    
                                    <div className="text-left md:text-right w-full md:w-auto p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl border md:border-none border-white/10">
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Paid (COD)</p>
                                        <p className="text-2xl font-black text-secondary">৳{orderData.finalTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="p-6 md:p-10 border-b border-gray-100 bg-gray-50/30">
                                <h3 className="font-extrabold text-gray-800 mb-8 border-b pb-2 border-gray-100 inline-block">Fulfillment Progress</h3>
                                
                                {orderData.status === 'Canceled' ? (
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                            <XCircle size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-red-700 mb-2">Order Canceled</h3>
                                        <p className="text-red-500/80 text-sm max-w-md">This order has been canceled. If this is a mistake, please place a new order or contact our support team immediately.</p>
                                        <Link href="/shop" className="mt-6 px-6 py-2.5 bg-white text-red-600 border border-red-200 font-bold rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                                            Return to Shop
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Connecting Line (Desktop) */}
                                        <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[3px] bg-gray-200 -z-10">
                                            {/* Progress Fill */}
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-secondary transition-all duration-1000 ease-out" 
                                                style={{ width: currentStatus.step === 1 ? '0%' : currentStatus.step === 2 ? '33.33%' : currentStatus.step === 3 ? '66.66%' : '100%' }}
                                            ></div>
                                        </div>

                                        {/* Steps Container */}
                                        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                                            
                                            {/* Step 1: Pending */}
                                            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center z-10 relative">
                                                <div className="hidden md:block absolute w-full h-[3px] bg-gray-200 -z-10 top-[28px] -right-1/2"></div>
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 shrink-0 ${currentStatus.step >= 1 ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/30 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <Clock size={24} />
                                                </div>
                                                <div className="text-left md:text-center">
                                                    <p className={`font-black text-sm md:text-base mb-1 ${currentStatus.step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>Order Placed</p>
                                                    <p className="text-[11px] text-gray-500 hidden md:block max-w-[120px] leading-tight">We've received your order.</p>
                                                </div>
                                            </div>

                                            {/* Step 2: Processing */}
                                            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center z-10 relative">
                                                <div className="hidden md:block absolute w-full h-[3px] bg-gray-200 -z-10 top-[28px] -right-1/2"></div>
                                                {/* Mobile Connecting Line */}
                                                <div className="md:hidden absolute top-[-30px] bottom-[50px] left-[27px] w-[3px] bg-gray-200 -z-10">
                                                    <div className="absolute top-0 left-0 w-full bg-secondary transition-all duration-1000" style={{ height: currentStatus.step >= 2 ? '100%' : '0%' }}></div>
                                                </div>

                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 delay-100 shrink-0 ${currentStatus.step >= 2 ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/30 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <Package size={24} />
                                                </div>
                                                <div className="text-left md:text-center">
                                                    <p className={`font-black text-sm md:text-base mb-1 ${currentStatus.step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>Processing</p>
                                                    <p className="text-[11px] text-gray-500 hidden md:block max-w-[120px] leading-tight">Packaging your items securely.</p>
                                                </div>
                                            </div>

                                            {/* Step 3: Shipped */}
                                            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center z-10 relative">
                                                 <div className="hidden md:block absolute w-full h-[3px] bg-gray-200 -z-10 top-[28px] -right-1/2"></div>
                                                 {/* Mobile Connecting Line */}
                                                <div className="md:hidden absolute top-[-30px] bottom-[50px] left-[27px] w-[3px] bg-gray-200 -z-10">
                                                    <div className="absolute top-0 left-0 w-full bg-secondary transition-all duration-1000 delay-100" style={{ height: currentStatus.step >= 3 ? '100%' : '0%' }}></div>
                                                </div>

                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 delay-200 shrink-0 ${currentStatus.step >= 3 ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/30 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <Truck size={24} />
                                                </div>
                                                <div className="text-left md:text-center">
                                                    <p className={`font-black text-sm md:text-base mb-1 ${currentStatus.step >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>Shipped</p>
                                                    <p className="text-[11px] text-gray-500 hidden md:block max-w-[120px] leading-tight">Out for delivery to you.</p>
                                                </div>
                                            </div>

                                            {/* Step 4: Delivered */}
                                            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center z-10 relative">
                                                {/* Mobile Connecting Line */}
                                                <div className="md:hidden absolute top-[-30px] bottom-[50px] left-[27px] w-[3px] bg-gray-200 -z-10">
                                                    <div className="absolute top-0 left-0 w-full bg-green-500 transition-all duration-1000 delay-200" style={{ height: currentStatus.step >= 4 ? '100%' : '0%' }}></div>
                                                </div>

                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 delay-300 shrink-0 ${currentStatus.step >= 4 ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <div className="text-left md:text-center">
                                                    <p className={`font-black text-sm md:text-base mb-1 ${currentStatus.step >= 4 ? 'text-green-600' : 'text-gray-400'}`}>Delivered</p>
                                                    <p className="text-[11px] text-gray-500 hidden md:block max-w-[120px] leading-tight">Package has arrived!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Items Summary */}
                            <div className="p-6 md:p-8 bg-white">
                                <h3 className="font-extrabold text-gray-800 mb-4 pb-2 border-b border-gray-100">Package Contents ({orderData.items.length})</h3>
                                <div className="space-y-4">
                                    {orderData.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                                                <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">{item.name}</p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">Qty: {item.quantity}</span>
                                                    <span className="font-black text-secondary">৳{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Contact Support */}
                            <div className="bg-gray-50 p-4 mx-4 mb-4 rounded-xl border border-gray-200 flex sm:items-center gap-3 text-sm text-gray-600 flex-col sm:flex-row">
                                <Info className="text-secondary shrink-0" size={18} />
                                <p className="flex-1">Need help with this order? Our support team is ready.</p>
                                <a href="tel:+8801645368899" className="font-bold text-[#1a2b3c] bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-secondary hover:text-secondary transition-colors text-center">
                                    Contact Support
                                </a>
                            </div>

                        </div>
                    ) : hasAttempted && !orderData ? (
                        <div className="p-10 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center animate-in fade-in">
                            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No active order found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Please check if your Tracking ID is correct. It should look like "ORD-XXXX-XXXX".</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none py-10">
                            <MapPinTrackIcon width={120} height={120} opacity={0.2} />
                            <p className="mt-6 font-bold text-gray-400 text-lg uppercase tracking-widest">Waiting for ID Input...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple inline SVG map pin
const MapPinTrackIcon = ({ width = 24, height = 24, opacity = 1 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);
