"use client";
import React from 'react';
import Link from 'next/link';
import {
    Phone,
    MapPin,
    Mail,
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                            <span className="text-[#04211c] font-black text-2xl tracking-tighter uppercase">Amar Organic</span>
                            <span className="text-secondary font-black text-2xl tracking-tighter uppercase -mt-1">Shop</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm pt-2">
                            Amar Organic Shop is your trusted online destination for pure, natural, and healthy organic foods delivery across Bangladesh.
                        </p>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-400 shrink-0" />
                                <span>+880 1XXX-XXXXXX</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400 shrink-0" />
                                <span>support@amar-organic-shop.com</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Facebook size={16} /> */}
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Twitter size={16} /> */}
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Instagram size={16} /> */}
                            </a>
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
                                className="w-full h-auto object-contain max-h-16"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs text-center md:text-left">
                        Copyright © {currentYear} Amar Organic Shop. All rights reserved.
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