"use client";
import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Phone, Mail, Globe, LayoutTemplate, ToggleLeft, ToggleRight, LayoutDashboard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UISettingsPage() {
    const [settings, setSettings] = useState({
        logoUrl: '',
        heroBannerUrl: '',
        contactPhone: '',
        contactEmail: '',
        facebookUrl: '',
        topAnnouncementText: '',
        topAnnouncementIsActive: true,
        promoPopupImage: '',
        promoPopupLink: '',
        promoPopupIsActive: false,
        primaryColor: '#16a34a',
        secondaryColor: '#f39200',
        dualPosterOneImage: 'https://backoffice.ghorerbazar.com/banner/Tyz131763632384.png',
        dualPosterOneLink: '/',
        dualPosterTwoImage: 'https://admin.ghorerbazarbd.com/storage/banners/1709121683.jpg',
        dualPosterTwoLink: '/',
        sectionToggles: {
            showHero: true,
            showCategories: true,
            showTopSelling: true,
            showHoney: true,
            showPromo: true,
            showAllProducts: true,
            showTestimonials: true
        },
        sectionTitles: {
            topSelling: 'Top Selling Products',
            honey: 'All Natural Honey',
            allProducts: 'All Products'
        },
        aboutStoryText: '',
        aboutMissionText: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (res.ok && data) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    sectionToggles: {
                        ...prev.sectionToggles,
                        ...(data.sectionToggles || {})
                    },
                    sectionTitles: {
                        ...prev.sectionTitles,
                        ...(data.sectionTitles || {})
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (section) => {
        setSettings(prev => ({
            ...prev,
            sectionToggles: {
                ...prev.sectionToggles,
                [section]: !prev.sectionToggles[section]
            }
        }));
    };

    const handleTitleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            sectionTitles: {
                ...prev.sectionTitles,
                [name]: value
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                toast.success('Settings updated globally!');
            } else {
                toast.error('Failed to update settings');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-bold">Loading Settings...</p>
        </div>
    );

    const sections = [
        { id: 'showHero', label: 'Hero Banner Section' },
        { id: 'showCategories', label: 'Featured Categories Section' },
        { id: 'showTopSelling', label: 'Top Selling Products Section' },
        { id: 'showHoney', label: 'All Natural Honey Section' },
        { id: 'showPromo', label: 'Dual Promo Posters (Middle)' },
        { id: 'showAllProducts', label: 'All Products Grid' },
        { id: 'showTestimonials', label: 'Testimonials / Reviews Section' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">UI Configurator</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage global storefront visual assets, banners, layouts, and contacts.</p>
                </div>
                
                <div className="flex gap-3">
                    <a href="/admin/dashboard/categories" className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/20 transition-colors">
                        📁 Categories
                    </a>
                    <a href="/admin/dashboard/testimonials" className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-100 transition-colors">
                        💬 Testimonials
                    </a>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Visual Assets Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-purple-500" />
                        Branding & Images
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
                                Brand Logo URL
                                <span className="text-gray-400 font-normal">Optional</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <ImageIcon size={18} />
                                </div>
                                <input 
                                    type="url" 
                                    name="logoUrl"
                                    value={settings.logoUrl}
                                    onChange={handleChange}
                                    placeholder="Leave empty to use text logo..." 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                            {settings.logoUrl && settings.logoUrl.startsWith('http') && (
                                <div className="mt-3 relative h-16 w-16 md:w-32 rounded-lg border border-gray-100 bg-white p-1">
                                    <img src={settings.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                Main Hero Banner (1600x749 recommended)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <ImageIcon size={18} />
                                </div>
                                <input 
                                    type="url" 
                                    name="heroBannerUrl"
                                    value={settings.heroBannerUrl}
                                    onChange={handleChange}
                                    placeholder="https://..." 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                            {settings.heroBannerUrl && settings.heroBannerUrl.startsWith('http') && (
                                <div className="mt-3 relative h-24 md:h-32 w-full rounded-lg border border-gray-100 bg-white overflow-hidden p-1 shadow-inner">
                                    <img src={settings.heroBannerUrl} alt="Hero Preview" className="w-full h-full object-cover rounded-md" />
                                </div>
                            )}
                        </div>

                        {/* Theme Colors Configuration */}
                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Site Branding Colors
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Primary Color</label>
                                    <input 
                                        type="color" 
                                        name="primaryColor"
                                        value={settings.primaryColor}
                                        onChange={handleChange}
                                        className="w-full h-10 cursor-pointer rounded border-none bg-transparent"
                                    />
                                    <div className="text-center text-xs font-mono text-gray-400 mt-2">{settings.primaryColor}</div>
                                </div>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Secondary Color</label>
                                    <input 
                                        type="color" 
                                        name="secondaryColor"
                                        value={settings.secondaryColor}
                                        onChange={handleChange}
                                        className="w-full h-10 cursor-pointer rounded border-none bg-transparent"
                                    />
                                    <div className="text-center text-xs font-mono text-gray-400 mt-2">{settings.secondaryColor}</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                💡 Primary controls buttons and highlights. Secondary controls badges and accents.
                            </p>
                        </div>

                        {/* Top Announcement Bar Configuration */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-bold text-gray-700">
                                    Top Announcement Bar
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setSettings(prev => ({ ...prev, topAnnouncementIsActive: !prev.topAnnouncementIsActive }))}
                                    className={`transition-colors p-1 rounded-full ${settings.topAnnouncementIsActive ? 'text-green-500' : 'text-gray-300'}`}
                                >
                                    {settings.topAnnouncementIsActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="topAnnouncementText"
                                    value={settings.topAnnouncementText}
                                    onChange={handleChange}
                                    placeholder="Enter announcement text..." 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Promo Popup Modal Configuration */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-bold text-gray-700">
                                    Offers Popup Modal (Auto-pops on visit)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setSettings(prev => ({ ...prev, promoPopupIsActive: !prev.promoPopupIsActive }))}
                                    className={`transition-colors p-1 rounded-full ${settings.promoPopupIsActive ? 'text-green-500' : 'text-gray-300'}`}
                                >
                                    {settings.promoPopupIsActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <ImageIcon size={18} />
                                    </div>
                                    <input 
                                        type="url" 
                                        name="promoPopupImage"
                                        value={settings.promoPopupImage}
                                        onChange={handleChange}
                                        placeholder="Offer Image URL..." 
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                    />
                                </div>
                                {settings.promoPopupImage && settings.promoPopupImage.startsWith('http') && (
                                    <div className="relative h-32 w-32 rounded-lg border border-gray-100 bg-white p-1">
                                        <img src={settings.promoPopupImage} alt="Popup Preview" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Globe size={18} />
                                    </div>
                                    <input 
                                        type="url" 
                                        name="promoPopupLink"
                                        value={settings.promoPopupLink}
                                        onChange={handleChange}
                                        placeholder="Target Link (e.g., /products/honey)..." 
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dual Poster Configurations */}
                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-4">
                                Dual Promotional Posters (Middle Section)
                            </label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Poster One */}
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Poster One (Left)</h4>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <ImageIcon size={16} />
                                        </div>
                                        <input 
                                            type="url" 
                                            name="dualPosterOneImage"
                                            value={settings.dualPosterOneImage}
                                            onChange={handleChange}
                                            placeholder="Poster Image URL..." 
                                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    {settings.dualPosterOneImage && settings.dualPosterOneImage.startsWith('http') && (
                                        <div className="relative h-24 w-full rounded-lg border border-gray-100 bg-white overflow-hidden p-1 shadow-inner">
                                            <img src={settings.dualPosterOneImage} alt="Poster One Preview" className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Globe size={16} />
                                        </div>
                                        <input 
                                            type="url" 
                                            name="dualPosterOneLink"
                                            value={settings.dualPosterOneLink}
                                            onChange={handleChange}
                                            placeholder="Poster Link (e.g., /honey)..." 
                                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Poster Two */}
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Poster Two (Right)</h4>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <ImageIcon size={16} />
                                        </div>
                                        <input 
                                            type="url" 
                                            name="dualPosterTwoImage"
                                            value={settings.dualPosterTwoImage}
                                            onChange={handleChange}
                                            placeholder="Poster Image URL..." 
                                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    {settings.dualPosterTwoImage && settings.dualPosterTwoImage.startsWith('http') && (
                                        <div className="relative h-24 w-full rounded-lg border border-gray-100 bg-white overflow-hidden p-1 shadow-inner">
                                            <img src={settings.dualPosterTwoImage} alt="Poster Two Preview" className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Globe size={16} />
                                        </div>
                                        <input 
                                            type="url" 
                                            name="dualPosterTwoLink"
                                            value={settings.dualPosterTwoLink}
                                            onChange={handleChange}
                                            placeholder="Poster Link (e.g., /ghee)..." 
                                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Titles Manager */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                        Custom Section Titles
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">Change the exact text displayed above the home page product grids.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Top Selling Custom Title</label>
                            <input 
                                type="text" 
                                name="topSelling"
                                value={settings.sectionTitles.topSelling}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">All Natural Honey Title</label>
                            <input 
                                type="text" 
                                name="honey"
                                value={settings.sectionTitles.honey}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">All Products Grid Title</label>
                            <input 
                                type="text" 
                                name="allProducts"
                                value={settings.sectionTitles.allProducts}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* About Page Content Manager */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-teal-500" />
                        About Page Content
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">Manage the dynamically loaded text on the public "About Us" page.</p>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Our Story Text</label>
                            <textarea 
                                name="aboutStoryText"
                                value={settings.aboutStoryText}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-y"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">The Mission Text</label>
                            <textarea 
                                name="aboutMissionText"
                                value={settings.aboutMissionText}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-y"
                            />
                        </div>
                    </div>
                </div>

                {/* Homepage Layout Manager */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-amber-500" />
                        Homepage Layout Toggles
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">Turn off sections to dynamically hide them from the public storefront.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sections.map((sec) => (
                            <div key={sec.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                                <span className="font-semibold text-gray-700 text-sm">{sec.label}</span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleChange(sec.id)}
                                    className={`transition-colors p-1 rounded-full ${settings.sectionToggles[sec.id] ? 'text-green-500' : 'text-gray-300'}`}
                                >
                                    {settings.sectionToggles[sec.id] ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-500" />
                        Contact & Socials
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Support Phone</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    name="contactPhone"
                                    value={settings.contactPhone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Support Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    name="contactEmail"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Globe size={18} />
                                </div>
                                <input 
                                    type="url" 
                                    name="facebookUrl"
                                    value={settings.facebookUrl}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white transition-all shadow-lg shadow-primary/30 ${saving ? 'bg-gray-400' : 'bg-primary hover:bg-primary hover:brightness-90 hover:-translate-y-0.5'}`}
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
