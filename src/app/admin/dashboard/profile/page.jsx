'use client';

import React, { useState, useEffect } from 'react';
import { UserCircle, Key, Save, Loader2, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        username: ''
    });
    
    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            const data = await res.json();
            if (res.ok) {
                setProfile({ username: data.username });
            } else {
                toast.error(data.error || 'Failed to load profile');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (newPassword && newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setIsSaving(true);
        
        try {
            const payload = {
                username: profile.username
            };
            
            if (newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Profile updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred during save');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-bold">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-[30rem] h-[30rem] bg-blue-50 rounded-full blur-[80px]" />
                
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-xl relative z-10">
                    <UserCircle className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Admin Profile</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage your administrator credentials safely.</p>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Account Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        Account Details
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
                                Username (User ID)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserCircle size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-orange-500" />
                        Change Password
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-6">Leave these fields blank if you do not wish to change your password.</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Key size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter to authorize changes..." 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white transition-all shadow-lg ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-600/30'}`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? 'Saving Changes...' : 'Update Account'}
                    </button>
                </div>
            </form>
        </div>
    );
}
