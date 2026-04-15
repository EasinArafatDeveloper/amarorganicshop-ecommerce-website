"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Phone,
    MapPin,
    Mail,
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Failed to load footer settings", err);
            }
        };
        fetchSettings();
    }, []);

    const footerSections = [
        {
            title: "Shop By Categories",
            links: [
                { name: "Honey", href: "/honey" },
                { name: "Honey Nut", href: "/honey-nut" },
                { name: "Oil & Ghee", href: "/oil-ghee" },
                { name: "Dates", href: "/dates" },
                { name: "Spices", href: "/spices" },
                { name: "Nuts & Seeds", href: "/nuts-seeds" },
                { name: "All Products", href: "/shop" }
            ]
        },
        {
            title: "Quick Links",
            links: [
                { name: "Track Order", href: "/track-order" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" }
            ]
        },
        {
            title: "Consumer Policy",
            links: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms & Conditions", href: "/terms-of-service" },
                { name: "Return & Refund Policy", href: "/return-policy" },
                { name: "Shipping Info", href: "/shipping" }
            ]
        }
    ];

    return (
        <footer className="bg-white text-gray-700 pt-12 pb-6 border-t border-gray-100 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

                    {/* Brand & Contact Section */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="flex flex-col leading-tight cursor-pointer">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt="Amar Organic" className="h-[50px] w-auto max-w-[180px] object-contain" />
                            ) : (
                                <>
                                    <span className="text-[#04211c] font-black text-2xl tracking-tighter uppercase">Amar Organic</span>
                                    <span className="text-secondary font-black text-2xl tracking-tighter uppercase -mt-1">Shop</span>
                                </>
                            )}
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm pt-2">
                            {settings?.footerDescription || "Amar Organic Shop is your trusted online destination for pure, natural, and healthy organic foods delivery across Bangladesh."}
                        </p>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>{settings?.footerAddress || "Dhaka, Bangladesh"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-400 shrink-0" />
                                <a href={`https://wa.me/${(settings?.contactPhone || "+8801331005210").replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:underline transition-colors">
                                    {settings?.contactPhone || "+8801331005210"}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400 shrink-0" />
                                <a href={`mailto:${settings?.contactEmail || "amarorganicshop@gmail.com"}`} className="hover:text-secondary hover:underline transition-colors">
                                    {settings?.contactEmail || "amarorganicshop@gmail.com"}
                                </a>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            )}
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            )}
                            {settings?.linkedinUrl && (
                                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Links Sections */}
                    <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {footerSections.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link href={link.href} className="text-gray-500 hover:text-secondary text-sm transition-colors block py-0.5">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Section */}
                <div className="border-t border-gray-100 pt-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <h5 className="font-bold text-sm text-gray-800 uppercase tracking-widest">Pay With</h5>
                        <div className="w-full max-w-4xl opacity-70 hover:opacity-100 transition-opacity">
                            {/* Standard SSL Commerz / Bangladeshi Payment Gateway banner placeholder */}
                            <img
                                src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
                                alt="Payment Methods SSL Commerz"
                                className="h-14 lg:h-16 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs text-center md:text-left">
                        {settings?.footerCopyright ? (
                            settings.footerCopyright.replace('{year}', currentYear)
                        ) : (
                            `Copyright © ${currentYear} Amar Organic Shop. All rights reserved.`
                        )}
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="text-[11px] font-medium text-gray-400">Handcrafted with care for healthy living</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;