"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

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
        </CartContext.Provider>
    );
};
