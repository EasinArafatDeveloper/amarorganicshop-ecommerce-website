"use client";
import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Phone, Mail, Globe, LayoutTemplate, ToggleLeft, ToggleRight, LayoutDashboard, Loader2, Truck, Plus, Trash2 } from 'lucide-react';
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
        dualPosterOneImage: '',
        dualPosterOneLink: '/',
        dualPosterTwoImage: '',
        dualPosterTwoLink: '/',
        sectionToggles: {
            showHero: true, showCategories: true, showTopSelling: true, showHoney: true, showPromo: true, showAllProducts: true, showTestimonials: true
        },
        sectionTitles: {
            topSelling: 'Top Selling Products', honey: 'All Natural Honey', allProducts: 'All Products'
        },
        aboutStoryText: '',
        aboutMissionText: '',
        deliveryZones: []
    });
    const [activeTab, setActiveTab] = useState('branding');
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
                    },
                    deliveryZones: data.deliveryZones || []
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

    const handleAddDeliveryZone = () => {
        setSettings(prev => ({
            ...prev,
            deliveryZones: [...(prev.deliveryZones || []), { id: `zone_${Date.now()}`, label: '', cost: 0 }]
        }));
    };

    const handleDeliveryZoneChange = (index, field, value) => {
        const newZones = [...settings.deliveryZones];
        newZones[index][field] = field === 'cost' ? Number(value) : value;
        setSettings(prev => ({ ...prev, deliveryZones: newZones }));
    };

    const handleRemoveDeliveryZone = (index) => {
        const newZones = [...settings.deliveryZones];
        newZones.splice(index, 1);
        setSettings(prev => ({ ...prev, deliveryZones: newZones }));
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
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">System Settings</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage global storefront visual assets, configurations, and shipping.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-hide">
                <button type="button" onClick={() => setActiveTab('branding')} className={`px-4 py-2.5 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'branding' ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    Branding & Banners
                </button>
                <button type="button" onClick={() => setActiveTab('layout')} className={`px-4 py-2.5 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'layout' ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    Layout & Sections
                </button>
                <button type="button" onClick={() => setActiveTab('contact')} className={`px-4 py-2.5 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'contact' ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    Content & Contacts
                </button>
                <button type="button" onClick={() => setActiveTab('delivery')} className={`px-4 py-2.5 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'delivery' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    Delivery Zones
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* BRANDING TAB */}
                {activeTab === 'branding' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Visual Assets Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-purple-500" />
                                Branding Images
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
                                            type="url" name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Leave empty to use text logo..." 
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
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Hero Banner (1600x749 recommended)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <ImageIcon size={18} />
                                        </div>
                                        <input 
                                            type="url" name="heroBannerUrl" value={settings.heroBannerUrl} onChange={handleChange} placeholder="https://..." 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                        />
                                    </div>
                                    {settings.heroBannerUrl && settings.heroBannerUrl.startsWith('http') && (
                                        <div className="mt-3 relative h-24 md:h-32 w-full rounded-lg border border-gray-100 bg-white overflow-hidden p-1 shadow-inner">
                                            <img src={settings.heroBannerUrl} alt="Hero Preview" className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-100 pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Site Branding Colors</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Primary Color</label>
                                            <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} className="w-full h-10 cursor-pointer rounded border-none bg-transparent" />
                                            <div className="text-center text-xs font-mono text-gray-400 mt-2">{settings.primaryColor}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Secondary Color</label>
                                            <input type="color" name="secondaryColor" value={settings.secondaryColor} onChange={handleChange} className="w-full h-10 cursor-pointer rounded border-none bg-transparent" />
                                            <div className="text-center text-xs font-mono text-gray-400 mt-2">{settings.secondaryColor}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promotions and Banners */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Promotions & Bars</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-bold text-gray-700">Top Announcement Bar</label>
                                        <button type="button" onClick={() => setSettings(prev => ({ ...prev, topAnnouncementIsActive: !prev.topAnnouncementIsActive }))} className={`transition-colors p-1 rounded-full ${settings.topAnnouncementIsActive ? 'text-green-500' : 'text-gray-300'}`}>
                                            {settings.topAnnouncementIsActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                        </button>
                                    </div>
                                    <input type="text" name="topAnnouncementText" value={settings.topAnnouncementText} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-bold text-gray-700">Offers Popup Modal</label>
                                        <button type="button" onClick={() => setSettings(prev => ({ ...prev, promoPopupIsActive: !prev.promoPopupIsActive }))} className={`transition-colors p-1 rounded-full ${settings.promoPopupIsActive ? 'text-green-500' : 'text-gray-300'}`}>
                                            {settings.promoPopupIsActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="url" name="promoPopupImage" value={settings.promoPopupImage} onChange={handleChange} placeholder="Image URL..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                                        <input type="url" name="promoPopupLink" value={settings.promoPopupLink} onChange={handleChange} placeholder="Target Link (e.g. /product)..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-4">Dual Promotional Posters (Middle Section)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Poster One (Left)</h4>
                                            <input type="url" name="dualPosterOneImage" value={settings.dualPosterOneImage} onChange={handleChange} placeholder="Image URL..." className="w-full px-4 py-2 border rounded-lg mb-2" />
                                            <input type="url" name="dualPosterOneLink" value={settings.dualPosterOneLink} onChange={handleChange} placeholder="Link..." className="w-full px-4 py-2 border rounded-lg" />
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Poster Two (Right)</h4>
                                            <input type="url" name="dualPosterTwoImage" value={settings.dualPosterTwoImage} onChange={handleChange} placeholder="Image URL..." className="w-full px-4 py-2 border rounded-lg mb-2" />
                                            <input type="url" name="dualPosterTwoLink" value={settings.dualPosterTwoLink} onChange={handleChange} placeholder="Link..." className="w-full px-4 py-2 border rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LAYOUT & SECTIONS TAB */}
                {activeTab === 'layout' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Section Titles Manager */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                                Custom Section Titles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Top Selling Title</label><input type="text" name="topSelling" value={settings.sectionTitles.topSelling} onChange={handleTitleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Honey Section Title</label><input type="text" name="honey" value={settings.sectionTitles.honey} onChange={handleTitleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1.5">All Products Title</label><input type="text" name="allProducts" value={settings.sectionTitles.allProducts} onChange={handleTitleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" /></div>
                            </div>
                        </div>

                        {/* Homepage Layout Toggles */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-amber-500" />
                                Section Visibility
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections.map((sec) => (
                                    <div key={sec.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                                        <span className="font-semibold text-gray-700 text-sm">{sec.label}</span>
                                        <button type="button" onClick={() => handleToggleChange(sec.id)} className={`transition-colors p-1 rounded-full ${settings.sectionToggles[sec.id] ? 'text-green-500' : 'text-gray-300'}`}>
                                            {settings.sectionToggles[sec.id] ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT & CONTACTS TAB */}
                {activeTab === 'contact' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-500" />
                                Contact & Socials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Support Phone</label><input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Support Email</label><input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1.5">Facebook Page URL</label><input type="url" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" /></div>
                            </div>
                        </div>

                        {/* About Page */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-teal-500" />
                                About Page Content
                            </h3>
                            <div className="space-y-6">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Our Story Text</label><textarea name="aboutStoryText" value={settings.aboutStoryText} onChange={handleChange} rows={5} className="w-full px-4 py-3 bg-gray-50 border rounded-xl resize-y" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1.5">The Mission Text</label><textarea name="aboutMissionText" value={settings.aboutMissionText} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 border rounded-xl resize-y" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DELIVERY ZONES TAB */}
                {activeTab === 'delivery' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-amber-500" />
                                    Shipping Configurations
                                </h3>
                                <button type="button" onClick={handleAddDeliveryZone} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-bold text-sm hover:bg-amber-100 transition-colors flex items-center gap-2">
                                    <Plus size={16} /> Add Custom Zone
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Create dynamic delivery locations and shipping costs across the platform. These will instantly appear on the Checkout page.</p>

                            <div className="space-y-4">
                                {(!settings.deliveryZones || settings.deliveryZones.length === 0) && (
                                    <p className="text-center text-gray-400 font-medium py-10 border-2 border-dashed rounded-xl">No delivery zones configured.</p>
                                )}
                                
                                {settings.deliveryZones?.map((zone, index) => (
                                    <div key={zone.id} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                        <div className="w-full md:w-1/3">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Zone Unique ID</label>
                                            <input 
                                                type="text" 
                                                value={zone.id} 
                                                onChange={(e) => handleDeliveryZoneChange(index, 'id', e.target.value)} 
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Display Label</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Inside Dhaka"
                                                value={zone.label} 
                                                onChange={(e) => handleDeliveryZoneChange(index, 'label', e.target.value)} 
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery Cost</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                                                <input 
                                                    type="number" 
                                                    value={zone.cost} 
                                                    onChange={(e) => handleDeliveryZoneChange(index, 'cost', e.target.value)} 
                                                    className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-black text-secondary"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto md:ml-auto flex items-end pt-5">
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveDeliveryZone(index)}
                                                className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full md:w-auto flex justify-center"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Master Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 mt-10">
                    <button 
                        type="submit"
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white transition-all shadow-lg ${saving ? 'bg-gray-400 cursor-wait' : 'bg-primary hover:bg-primary hover:brightness-90 hover:shadow-primary/30 hover:-translate-y-0.5'}`}
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
