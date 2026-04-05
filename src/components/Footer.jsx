"use client";
import React from 'react';
import {
    Phone,
    MapPin,
    Mail,
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Information",
            links: ["About us", "Contact us", "Company Information", "Ghorer Bazar Stories", "Terms & Conditions", "Privacy Policy", "Careers"]
        },
        {
            title: "Shop By",
            links: ["Oil & Ghee", "Honey", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Functional Foods"]
        },
        {
            title: "Support",
            links: ["Support Center", "How to Order", "Order Tracking", "Payment", "Shipping", "FAQ"]
        },
        {
            title: "Consumer Policy",
            links: ["Happy Return", "Refund Policy", "Exchange", "Cancellation", "Pre-Order", "Extra Discount"]
        }
    ];

    return (
        <footer className="bg-white text-gray-700 pt-12 pb-6 border-t border-gray-100 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

                    {/* Brand & Contact Section */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://www.ghorerbazar.com/_next/static/media/logo.8d2f5e74.png"
                                alt="Ghorer Bazar Logo"
                                className="h-12 w-auto"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150x50?text=GHORER+BAZAR'; }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                            Ghorer Bazar is an e-commerce platform dedicated to providing safe and reliable food to every home.
                        </p>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>Rampura, Dhaka, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-400 shrink-0" />
                                <span>09642922922</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400 shrink-0" />
                                <span>contact@ghorerbazar.com</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Facebook size={16} /> */}
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Twitter size={16} /> */}
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                                {/* <Instagram size={16} /> */}
                            </a>
                        </div>
                    </div>

                    {/* Dynamic Links Sections */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors block py-0.5">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Payment Section (App Download Removed as per request) */}
                <div className="border-t border-gray-100 pt-10">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <h5 className="font-bold text-sm text-gray-800 uppercase tracking-widest">Pay With</h5>
                        <div className="w-full max-w-4xl">
                            <img
                                src="https://backoffice.ghorerbazar.com/company_logo/faysy1756641916.png"
                                alt="Payment Methods"
                                className="w-full h-auto object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        Copyright © {currentYear} GhorerBazar. All rights reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="text-[10px] text-gray-300">Handcrafted with care for healthy living</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;