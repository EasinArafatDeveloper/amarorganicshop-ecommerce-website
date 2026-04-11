"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingCart } from "lucide-react";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const router = useRouter();

    // Load cart from local storage on initial mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart JSON", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) { // Only save after initial load to prevent overwriting with empty array
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (product, quantity = 1, openDrawer = true, variant = null) => {
        if (!variant && product.variants && product.variants.length > 0) {
            setPendingProduct({ product, quantity, openDrawer, isBuyNow: false });
            return;
        }

        setCartItems((prevItems) => {
            const baseId = product.id;
            const unitSuffix = variant ? variant.unit : product.unit;
            // Generate a unique cartItemId for this variant
            const cartItemId = `${baseId}-${unitSuffix}`;

            const existingItem = prevItems.find(item => (item.cartItemId || item.id) === cartItemId);
            if (existingItem) {
                return prevItems.map(item =>
                    (item.cartItemId || item.id) === cartItemId 
                    ? { ...item, quantity: item.quantity + quantity } 
                    : item
                );
            }
            
            // Add new item with variant price integration
            return [...prevItems, { 
                ...product, 
                cartItemId,
                quantity,
                // Overwrite root properties with variant properties if they exist
                price: variant ? variant.price : product.price,
                originalPrice: variant ? variant.originalPrice : product.originalPrice,
                unit: variant ? variant.unit : product.unit
            }];
        });
        
        // Auto-open the cart drawer when something is added, unless prevented
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };

    const buyNow = (product, quantity = 1, variant = null) => {
        if (!variant && product.variants && product.variants.length > 0) {
            setPendingProduct({ product, quantity, openDrawer: false, isBuyNow: true });
            return;
        }
        
        // Pass a local bypass so it doesn't loop
        setCartItems((prevItems) => {
            const baseId = product.id;
            const unitSuffix = variant ? variant.unit : product.unit;
            const cartItemId = `${baseId}-${unitSuffix}`;
            const existingItem = prevItems.find(item => (item.cartItemId || item.id) === cartItemId);
            if (existingItem) {
                return prevItems.map(item => (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prevItems, { 
                ...product, cartItemId, quantity,
                price: variant ? variant.price : product.price,
                originalPrice: variant ? variant.originalPrice : product.originalPrice,
                unit: variant ? variant.unit : product.unit
            }];
        });
        
        router.push('/checkout');
    };

    const handleConfirmVariant = (variant) => {
        if (!pendingProduct) return;
        const { product, quantity, openDrawer, isBuyNow } = pendingProduct;
        setPendingProduct(null);

        if (isBuyNow) {
            buyNow(product, quantity, variant);
        } else {
            // Using a direct call to bypass the intercept as variant is now non-null
            addToCart(product, quantity, openDrawer, variant);
        }
    };

    const removeFromCart = (cartItemIdOrId) => {
        setCartItems((prevItems) => prevItems.filter(item => (item.cartItemId || item.id) !== cartItemIdOrId));
    };

    const updateQuantity = (cartItemIdOrId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) => 
            prevItems.map(item => 
                (item.cartItemId || item.id) === cartItemIdOrId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isLoaded,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}

            {/* Global Variant Selection Modal */}
            {pendingProduct && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPendingProduct(null)}></div>
                    <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setPendingProduct(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-1 transition-colors">
                            <X size={20} />
                        </button>
                        
                        <div className="flex gap-4 items-center mb-6 border-b border-gray-100 pb-4">
                            <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <img src={pendingProduct.product.image} alt={pendingProduct.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1a2b3c] leading-tight line-clamp-2">{pendingProduct.product.name}</h3>
                                <p className="text-secondary font-black mt-1">৳{pendingProduct.product.price.toLocaleString()}</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-gray-700 mb-3">Please select a variation:</h4>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {pendingProduct.product.variants.map((v, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleConfirmVariant(v)}
                                    className="border border-gray-200 rounded-xl p-3 text-left hover:border-secondary hover:bg-secondary/5 transition-colors group"
                                >
                                    <div className="text-xs font-bold text-gray-500 group-hover:text-secondary uppercase">{v.unit}</div>
                                    <div className="font-black text-gray-800 text-sm mt-0.5 group-hover:text-secondary">৳{v.price.toLocaleString()}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </CartContext.Provider>
    );
};
