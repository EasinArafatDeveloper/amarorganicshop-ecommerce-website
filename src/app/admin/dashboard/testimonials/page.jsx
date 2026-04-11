"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare, User, Image as ImageIcon, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function TestimonialsAdmin() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const endpoint = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingId ? 'Testimonial Updated!' : 'Testimonial Added!');
                setFormData({ name: '', role: '', image: '', comment: '' });
                setEditingId(null);
                fetchReviews();
            } else {
                toast.error('Failed to save testimonial');
            }
        } catch (error) {
            toast.error('Error saving review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (review) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingId(review._id);
        setFormData({
            name: review.name,
            role: review.role,
            image: review.image || '',
            comment: review.comment
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Testimonial?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Testimonial removed');
                    fetchReviews();
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
                    <MessageSquare className="w-6 h-6 text-indigo-500" />
                    Manage Testimonials
                </h2>
                <p className="text-gray-500 text-sm mt-1">Add, edit, or remove customer reviews shown on the storefront.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Add New Testimonial Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Review' : 'Add New Review'}</h3>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', role: '', image: '', comment: '' }); }} className="text-sm text-gray-400 hover:text-red-500">
                                    Cancel
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Customer Name</label>
                                <input 
                                    required type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    placeholder="e.g. Fariha Akter" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Role / Subtitle</label>
                                <input 
                                    required type="text" name="role" value={formData.role} onChange={handleInputChange}
                                    placeholder="e.g. Entrepreneur" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
                                    Display Image URL
                                    <span className="text-gray-400 font-normal">Optional</span>
                                </label>
                                <input 
                                    type="url" name="image" value={formData.image} onChange={handleInputChange}
                                    placeholder="https://..." 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Customer Comment</label>
                                <textarea 
                                    required name="comment" value={formData.comment} onChange={handleInputChange}
                                    rows="4" placeholder="Their review..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm resize-none"
                                />
                            </div>
                            <button 
                                type="submit" disabled={isSubmitting}
                                className={`w-full py-3 text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}
                            >
                                {editingId ? <Edit size={18} /> : <Plus size={18} />}
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Testimonial' : 'Publish Testimonial'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Testimonials List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Published Reviews ({reviews.length})</h3>
                        
                        {loading ? (
                            <div className="text-center py-12 text-gray-400 font-bold">Loading...</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-bold">
                                No testimonials published yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map(review => (
                                    <div key={review._id} className={`border ${editingId === review._id ? 'border-amber-400 shadow-amber-100' : 'border-gray-100 hover:border-indigo-200'} rounded-xl p-5 transition-colors group bg-white shadow-sm flex flex-col relative`}>
                                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 bg-white rounded-md transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(review)}
                                                className="text-gray-400 hover:text-amber-500 p-1"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(review._id)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                                                <img src={review.image || 'https://via.placeholder.com/150'} alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 leading-tight">{review.name}</h4>
                                                <p className="text-xs text-gray-500">{review.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-4">
                                                "{review.comment}"
                                            </p>
                                        </div>
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
