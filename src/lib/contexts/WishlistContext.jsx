"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load wishlist from local storage on initial mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (e) {
                console.error("Failed to parse wishlist JSON", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isLoaded]);

    const addToWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                toast.success("Already in your wishlist!");
                return prevItems;
            }
            toast.success("Added to wishlist!");
            return [...prevItems, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prevItems) => {
            toast.success("Removed from wishlist!");
            return prevItems.filter(item => item.id !== productId);
        });
    };

    const toggleWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const isExisting = prevItems.some(item => item.id === product.id);
            if (isExisting) {
                toast.success("Removed from wishlist!");
                return prevItems.filter(item => item.id !== product.id);
            } else {
                toast.success("Added to wishlist!");
                return [...prevItems, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
        toast.success("Wishlist cleared!");
    };

    const wishlistCount = wishlistItems.length;

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        isLoaded
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
