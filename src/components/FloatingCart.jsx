"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function FloatingCart() {
    const { cartCount, cartTotal, isLoaded } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isLoaded) return null;

    return (
        <div 
            onClick={() => router.push('/checkout')}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer shadow-2xl transition-transform hover:-translate-x-2 duration-300"
            style={{ width: '80px' }}
        >
            {/* Top section: Orange Background */}
            <div className="w-full bg-[#f07b22] rounded-tl-lg text-white flex flex-col items-center justify-center py-3">
                <ShoppingBag className="w-7 h-7 mb-1" />
                <span className="text-[13px] font-semibold text-center leading-tight tracking-wide">
                    {cartCount} Items
                </span>
            </div>
            
            {/* Bottom section: White Background */}
            <div className="w-full bg-white rounded-bl-lg text-[#f07b22] flex items-center justify-center py-2 shadow-inner drop-shadow">
                <span className="text-sm font-bold tracking-tight">
                    ৳{cartTotal.toFixed(2)}
                </span>
            </div>
        </div>
    );
}
