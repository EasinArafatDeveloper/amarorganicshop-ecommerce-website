'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, Search, Loader2, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state for reading message
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id, currentReadStatus) => {
        if (currentReadStatus) return; // Already read
        
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: 'PATCH'
            });
            if (res.ok) {
                setMessages(messages.map(msg => 
                    msg._id === id ? { ...msg, isRead: true } : msg
                ));
            }
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Message deleted successfully');
                setMessages(messages.filter(msg => msg._id !== id));
                if (selectedMessage?._id === id) setSelectedMessage(null);
            } else {
                toast.error('Failed to delete message');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const openMessageDetails = (msg) => {
        setSelectedMessage(msg);
        markAsRead(msg._id, msg.isRead);
    };

    const closeMessageDetails = () => {
        setSelectedMessage(null);
    };

    const filteredMessages = messages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800">Customer Inbox</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            You have <span className="text-blue-600 font-bold">{unreadCount} unread</span> messages
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading inbox...</p>
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                        <Mail size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Messages Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                        {searchTerm ? 'No messages match your current search.' : 'Your inbox is currently empty. New contact form submissions will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="p-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest min-w-[200px]">Sender</th>
                                    <th className="p-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest min-w-[250px]">Subject & Message</th>
                                    <th className="p-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-[150px]">Date</th>
                                    <th className="p-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-center w-[100px]">Status</th>
                                    <th className="p-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right w-[100px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.map((msg) => (
                                    <tr 
                                        key={msg._id} 
                                        onClick={() => openMessageDetails(msg)}
                                        className={`border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer group ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <td className="p-4 py-4 align-top">
                                            <div className="flex flex-col">
                                                <span className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.name}</span>
                                                <span className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{msg.contactInfo}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 py-4 align-top max-w-[300px]">
                                            <div className="flex flex-col">
                                                <span className={`text-sm truncate ${!msg.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>{msg.subject}</span>
                                                <span className={`text-xs mt-1 line-clamp-1 ${!msg.isRead ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    {msg.message}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td className="p-4 py-4 align-top">
                                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                                {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        
                                        <td className="p-4 py-4 align-top text-center">
                                            {!msg.isRead ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div> New
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                                                    <CheckCircle className="w-3 h-3" /> Read
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td className="p-4 py-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openMessageDetails(msg); }}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Read Message Modal Overlay */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800">Message Details</h3>
                            <button 
                                onClick={closeMessageDetails}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:text-gray-800 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 font-black rounded-full flex items-center justify-center text-lg">
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{selectedMessage.name}</h4>
                                        <a href={selectedMessage.contactInfo.includes('@') ? `mailto:${selectedMessage.contactInfo}` : `tel:${selectedMessage.contactInfo}`} className="text-sm text-blue-600 hover:underline">
                                            {selectedMessage.contactInfo}
                                        </a>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 block">
                                        {new Date(selectedMessage.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</p>
                                <h3 className="text-lg font-black text-gray-800 mb-6">{selectedMessage.subject}</h3>
                                
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                             <a 
                                href={selectedMessage.contactInfo.includes('@') ? `mailto:${selectedMessage.contactInfo}?subject=Re: ${selectedMessage.subject}` : `tel:${selectedMessage.contactInfo}`}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-md"
                            >
                                Reply Automatically
                            </a>
                            <button 
                                onClick={() => deleteMessage(selectedMessage._id)}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
