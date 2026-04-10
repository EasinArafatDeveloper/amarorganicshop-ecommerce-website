"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';

export default function GlobalOverlays() {
    const [settings, setSettings] = useState(null);
    const [showPromo, setShowPromo] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/public-settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                    
                    // Handle Promo Popup logic
                    if (data.promoPopupIsActive && data.promoPopupImage) {
                        const hasSeenPromo = sessionStorage.getItem('promoSeen');
                        if (!hasSeenPromo) {
                            // Slight delay for better UX
                            setTimeout(() => setShowPromo(true), 1500);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load global settings");
            }
        };

        fetchSettings();
    }, []);

    const closePromo = () => {
        setShowPromo(false);
        sessionStorage.setItem('promoSeen', 'true');
    };

    if (!settings) return null;

    return (
        <>
            {/* Top Announcement Bar */}
            {settings.topAnnouncementIsActive && settings.topAnnouncementText && (
                <div className="bg-green-600 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center z-50 relative shadow-sm break-words">
                    {settings.topAnnouncementText}
                </div>
            )}

            {/* Promotional Popup Modal */}
            {showPromo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm animation-fade-in"
                        onClick={closePromo}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-md md:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={closePromo}
                            className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        {settings.promoPopupLink ? (
                            <Link href={settings.promoPopupLink} onClick={closePromo} className="block relative group overflow-hidden">
                                <img 
                                    src={settings.promoPopupImage} 
                                    alt="Special Offer" 
                                    className="w-full h-auto object-cover max-h-[70vh] transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                                        View Offer <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="relative">
                                <img 
                                    src={settings.promoPopupImage} 
                                    alt="Special Offer" 
                                    className="w-full h-auto object-cover max-h-[70vh]"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
