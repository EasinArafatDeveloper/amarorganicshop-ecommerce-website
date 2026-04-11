"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CategoriesAdmin() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Create Mode State
    const [formData, setFormData] = useState({
        name: '',
        label: '',
        slug: '',
        hasSub: false,
        subItemsRaw: '' // Comma separated string for UX speed
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        
        // Auto-generate slug from name if typing name
        if (name === 'name' && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/\s+/g, '-')
            }));
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Convert raw string to array of subcat objects if hasSub is true
        let subItemsFormatted = [];
        if (formData.hasSub && formData.subItemsRaw) {
            subItemsFormatted = formData.subItemsRaw.split(',').map(item => {
                const trimmed = item.trim();
                return {
                    name: trimmed,
                    slug: trimmed.toLowerCase().replace(/\s+/g, '-')
                };
            }).filter(i => i.name !== '');
        }

        const payload = {
            name: formData.name,
            label: formData.label,
            slug: formData.slug.toLowerCase(),
            hasSub: formData.hasSub,
            subItems: subItemsFormatted
        };

        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Category Updated!' : 'Category Added!');
                setFormData({ name: '', label: '', slug: '', hasSub: false, subItemsRaw: '' });
                setEditingId(null);
                fetchCategories();
            } else {
                toast.error('Failed or Duplicate Slug');
            }
        } catch (error) {
            toast.error(editingId ? 'Error updating category' : 'Error adding category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (cat) => {
        setEditingId(cat._id);
        const rawSubItems = cat.hasSub && cat.subItems ? cat.subItems.map(i => i.name).join(', ') : '';
        setFormData({
            name: cat.name,
            label: cat.label,
            slug: cat.slug,
            hasSub: cat.hasSub,
            subItemsRaw: rawSubItems
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', label: '', slug: '', hasSub: false, subItemsRaw: '' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: "This removes it from the main Navigation!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Yes, delete!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Category removed');
                    fetchCategories();
                } else {
                    toast.error('Failed to delete');
                }
            } catch (error) {
                toast.error('Error occurred');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                    <FolderTree className="w-6 h-6 text-primary" />
                    Manage Store Categories
                </h2>
                <p className="text-gray-500 text-sm mt-1">Add or remove Navigation links and subcategories dynamically.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Add/Edit Category Form */}
                <div className="lg:col-span-1">
                    <div className={`bg-white rounded-2xl shadow-sm border p-6 sticky top-24 transition-colors ${editingId ? 'border-primary/50 shadow-primary/10' : 'border-gray-100'}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Edit Category' : 'Create Category'}
                            </h3>
                            {editingId && (
                                <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-800 font-bold px-3 py-1 bg-gray-100 rounded-lg transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name (English)</label>
                                <input 
                                    required type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    placeholder="e.g. Honey" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Translated Label</label>
                                <input 
                                    required type="text" name="label" value={formData.label} onChange={handleInputChange}
                                    placeholder="e.g. মধু (Honey)" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">URL Slug</label>
                                <input 
                                    required type="text" name="slug" value={formData.slug} onChange={handleInputChange}
                                    placeholder="e.g. honey" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" name="hasSub" 
                                        checked={formData.hasSub} onChange={handleInputChange}
                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="text-sm font-bold text-gray-700">Has Sub-categories?</span>
                                </label>
                            </div>

                            {formData.hasSub && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Sub-categories (Comma separated)</label>
                                    <textarea 
                                        name="subItemsRaw" value={formData.subItemsRaw} onChange={handleInputChange}
                                        rows="3" placeholder="Sundarban Honey, Litchi Flower Honey, Hill Flower Honey"
                                        className="w-full px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm resize-none"
                                    />
                                    <p className="text-[11px] text-gray-500 mt-1">Separate each item with a comma. Slugs will be auto-generated.</p>
                                </div>
                            )}

                            <button 
                                type="submit" disabled={isSubmitting}
                                className={`w-full py-3 text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-primary hover:bg-primary hover:brightness-90 shadow-primary/30'}`}
                            >
                                {editingId ? <Save size={18} /> : <Plus size={18} />}
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Active Navigation Menu ({categories.length})</h3>
                        
                        {loading ? (
                            <div className="text-center py-12 text-gray-400 font-bold">Loading...</div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold">
                                No categories. Please create one!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {categories.map(cat => (
                                    <div key={cat._id} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors group bg-white shadow-sm flex flex-col relative overflow-hidden">
                                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-md z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-sm p-1">
                                            <button 
                                                onClick={() => handleEditClick(cat)}
                                                className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat._id)}
                                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                                    {cat.label}
                                                    {cat.hasSub && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Has Sub</span>}
                                                </h4>
                                                <p className="text-xs text-gray-400 font-mono mt-1">/{cat.slug}</p>
                                            </div>
                                        </div>

                                        {cat.hasSub && cat.subItems && cat.subItems.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-50">
                                                <div className="flex flex-wrap gap-2">
                                                    {cat.subItems.map((sub, idx) => (
                                                        <div key={idx} className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-between group/sub">
                                                            <span>{sub.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
