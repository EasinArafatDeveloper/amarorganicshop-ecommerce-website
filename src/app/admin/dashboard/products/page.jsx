"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this product deletion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;
        
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                toast.success('Product has been deleted.');
            } else {
                toast.error('Failed to delete product.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products Directory</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your catalog, edit details, and add new items.</p>
                </div>
                <Link href="/admin/dashboard/products/add" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
                    <Plus className="w-5 h-5" />
                    New Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-[#04211c] text-white">
                            <tr>
                                <th className="py-4 px-6 text-sm font-semibold w-24">Image</th>
                                <th className="py-4 px-6 text-sm font-semibold">Product Details</th>
                                <th className="py-4 px-6 text-sm font-semibold">Code</th>
                                <th className="py-4 px-6 text-sm font-semibold">Category</th>
                                <th className="py-4 px-6 text-sm font-semibold">Price</th>
                                <th className="py-4 px-6 text-sm font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">Fetching database...</td>
                                </tr>
                             ) : products.map(product => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors group">
                                    <td className="py-3 px-6">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100 shadow-sm">
                                            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="font-bold text-gray-800">{product.name}</div>
                                        {product.nameBn && <div className="text-xs text-gray-400 mt-0.5">{product.nameBn}</div>}
                                    </td>
                                    <td className="py-3 px-6 text-sm">
                                        <span className="bg-orange-50 text-[#f39200] border border-orange-100 px-2 py-1 rounded text-xs font-mono font-bold">{product.productCode || 'N/A'}</span>
                                    </td>
                                    <td className="py-3 px-6 text-sm">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">{product.category}</span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className="text-green-600 font-black">৳{product.price}</span>
                                    </td>
                                    <td className="py-3 px-6 text-right space-x-2">
                                        <Link href={`/admin/dashboard/products/${product.id}/edit`} className="inline-block p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Edit className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(product.id)} className="inline-block p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}
