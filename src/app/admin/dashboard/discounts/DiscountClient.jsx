"use client";

import { useState } from 'react';
import { Tag, Search, CheckCircle2, AlertCircle, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DiscountClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [updating, setUpdating] = useState(null); // Track ID of product being updated

    // Maintain local state for the input fields so they can be edited seamlessly
    const [editPrices, setEditPrices] = useState(
        initialProducts.reduce((acc, p) => ({
            ...acc,
            [p._id]: {
                price: p.price || '',
                originalPrice: p.originalPrice || ''
            }
        }), {})
    );

    const handleInputChange = (id, field, value) => {
        setEditPrices(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleApplyDiscount = async (id) => {
        setUpdating(id);
        const { price, originalPrice } = editPrices[id];

        try {
            const res = await fetch('/api/admin/products/discount', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    _id: id, 
                    price: Number(price), 
                    originalPrice: originalPrice ? Number(originalPrice) : null 
                })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success('Price Updated Successfully');
                
                // Update local state to reflect the change visually
                setProducts(prev => prev.map(p => p._id === id ? {
                    ...p, 
                    price: data.product.price, 
                    originalPrice: data.product.originalPrice
                } : p));
            } else {
                toast.error('Failed to update price');
            }
        } catch (error) {
            toast.error('Network Error during update');
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productCode && p.productCode.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Active Discounts</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Manage global product pricing and flash sales</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Discount Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing Configuration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-10 text-center text-gray-500 font-medium">
                                        No products match your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const states = editPrices[product._id];
                                    const isOnSale = product.originalPrice && product.originalPrice > product.price;

                                    return (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Product Identity */}
                                            <td className="p-4 align-top w-[35%]">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white shadow-sm shrink-0 p-1 flex items-center justify-center">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-contain rounded-lg"
                                                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{product.name}</p>
                                                        {product.productCode && <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">{product.productCode}</p>}
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{product.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Indicator */}
                                            <td className="p-4 align-middle">
                                                {isOnSale ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-full shadow-sm">
                                                        <Percent size={12} /> On Sale
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full border border-gray-200">
                                                        <CheckCircle2 size={12} /> Regular
                                                    </span>
                                                )}
                                            </td>

                                            {/* Editor Panel */}
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                                    
                                                    {/* Strikethrough box */}
                                                    <div className="flex flex-col w-full sm:w-1/3">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 line-through">Original Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                                                            <input 
                                                                type="number"
                                                                value={states.originalPrice || ''}
                                                                onChange={(e) => handleInputChange(product._id, 'originalPrice', e.target.value)}
                                                                className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm font-bold text-gray-500 transition-all placeholder:font-normal placeholder:text-gray-300"
                                                                placeholder="e.g. 1500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Arrow indicator */}
                                                    <div className="hidden sm:flex text-gray-300 mt-5">→</div>

                                                    {/* Main Sale Price Box */}
                                                    <div className="flex flex-col w-full sm:w-1/3">
                                                        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Selling Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-bold text-xs">৳</span>
                                                            <input 
                                                                type="number"
                                                                value={states.price || ''}
                                                                onChange={(e) => handleInputChange(product._id, 'price', e.target.value)}
                                                                className="w-full pl-7 pr-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm font-black text-gray-900 transition-all placeholder:font-normal placeholder:text-gray-300"
                                                                placeholder="e.g. 1200"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="flex flex-col w-full sm:w-auto sm:mt-5 ml-auto">
                                                        <button
                                                            onClick={() => handleApplyDiscount(product._id)}
                                                            disabled={updating === product._id}
                                                            className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all focus:ring-2 focus:ring-offset-2 ${
                                                                updating === product._id
                                                                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                                    : 'bg-gray-900 text-white hover:bg-black focus:ring-gray-900'
                                                            }`}
                                                        >
                                                            {updating === product._id ? 'Saving...' : 'Apply Live'}
                                                        </button>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
