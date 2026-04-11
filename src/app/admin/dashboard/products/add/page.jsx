"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [variants, setVariants] = useState([{ unit: '1kg', price: '', originalPrice: '' }]);
    const [formData, setFormData] = useState({
        name: '',
        nameBn: '',
        category: 'honey',
        subCategory: '',
        image: '',
        description: '',
        inStock: true,
        isOrganic: false,
        badge: '',
    });

    const categories = ['honey', 'dates', 'oil-ghee', 'spices', 'nuts-seeds', 'sugar-jaggery', 'beverage-dairy', 'snacks', 'pink-salt', 'honey-nut'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { unit: '', price: '', originalPrice: '' }]);
    };

    const removeVariant = (index) => {
        if (variants.length > 1) {
            const newVariants = [...variants];
            newVariants.splice(index, 1);
            setVariants(newVariants);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate variants
        if (variants.length === 0 || !variants[0].price || !variants[0].unit) {
            toast.error('At least one valid variant with price and unit is required');
            return;
        }
        
        setLoading(true);

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Top level fallbacks using the first variant
                    price: Number(variants[0].price),
                    originalPrice: variants[0].originalPrice ? Number(variants[0].originalPrice) : undefined,
                    unit: variants[0].unit,
                    // Map variants perfectly
                    variants: variants.map(v => ({
                        unit: v.unit,
                        price: Number(v.price),
                        originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined
                    }))
                })
            });

            if (res.ok) {
                toast.success('Product added successfully!');
                router.push('/admin/dashboard/products');
            } else {
                const data = await res.json();
                toast.error(`Failed to add product: ${data.details || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong resolving the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/dashboard/products" className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors bg-white shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Add New Product</h2>
                    <p className="text-gray-500 text-sm">Fill in the details below to add a new product to the catalog.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Product Name (English) *</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white" placeholder="e.g. Sundarban Honey" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Product Name (Bengali)</label>
                            <input type="text" name="nameBn" value={formData.nameBn} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white" placeholder="e.g. সুন্দরবনের মধু" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Category *</label>
                            <select required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white">
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Sub-Category (Slug form)</label>
                            <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white" placeholder="e.g. sundarban-honey" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white resize-none" placeholder="Enter full product description..."></textarea>
                    </div>
                </div>

                {/* Pricing & Logistics (Variants) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Pricing & Logistics (Variants)</h3>
                        <button type="button" onClick={addVariant} className="text-sm font-bold text-primary hover:text-green-700 bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Plus size={16} /> Add Variant
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 border border-gray-200 p-4 rounded-xl relative group">
                                {variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                                        <Minus size={14} />
                                    </button>
                                )}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Unit Label *</label>
                                    <input required type="text" value={variant.unit} onChange={(e) => handleVariantChange(index, 'unit', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-white font-medium" placeholder="e.g. 500gm or 1kg" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Price (৳) *</label>
                                    <input required type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-white font-mono" placeholder="400" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Original Price (৳)</label>
                                    <input type="number" value={variant.originalPrice} onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all text-sm bg-white font-mono" placeholder="500 (Crossed out)" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Media & Tags */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Media & Badges</h3>
                    
                    <div className="space-y-4 mb-6">
                        <label className="text-sm font-bold text-gray-700">Image URL *</label>
                        <div className="flex items-center gap-4">
                            {formData.image ? (
                                <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 shrink-0 bg-gray-50">
                                    <ImageIcon strokeWidth={1.5} />
                                </div>
                            )}
                            <input required type="text" name="image" value={formData.image} onChange={handleChange} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white" placeholder="https://example.com/image.jpg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Promotional Badge</label>
                            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm bg-gray-50 focus:bg-white" placeholder="e.g. Best Seller, Offered Items" />
                        </div>
                        
                        <div className="flex flex-col gap-4 mt-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-green-500" />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Product is In Stock</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-green-500" />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">100% Organic Certified</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-4">
                    <Link href="/admin/dashboard/products" className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary hover:brightness-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {loading ? 'Saving to Database...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
