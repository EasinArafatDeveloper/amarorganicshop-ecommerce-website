"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Search, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function IPBlocklistPage() {
    const [ipStats, setIpStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(null); // stores IP being toggled

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/ip-management');
            if (res.ok) {
                const data = await res.json();
                setIpStats(data);
            }
        } catch (error) {
            toast.error("Failed to fetch IP statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const toggleBlock = async (ip, currentStatus) => {
        setIsProcessing(ip);
        const action = currentStatus ? 'unblock' : 'block';
        try {
            const res = await fetch('/api/admin/ip-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, action })
            });

            if (res.ok) {
                toast.success(`IP ${action}ed successfully`);
                fetchStats();
            } else {
                toast.error("Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsProcessing(null);
        }
    };

    const filteredStats = ipStats.filter(stat => 
        stat.ip.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalBlocked = ipStats.filter(s => s.isBlocked).length;
    const flaggedCount = ipStats.filter(s => s.orderCount >= 5 && !s.isBlocked).length;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                    <ShieldAlert className="text-red-500 w-8 h-8" />
                    IP Blocklist & Fraud Prevention
                </h2>
                <p className="text-gray-500 text-sm mt-1">Track suspicious activity and block fake order sources.</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider text-[10px]">Total Unique IPs</p>
                        <p className="text-2xl font-black text-gray-800">{ipStats.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider text-[10px]">Active Blocks</p>
                        <p className="text-2xl font-black text-gray-800">{totalBlocked}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider text-[10px]">Red Flags ({'>'}5 orders)</p>
                        <p className="text-2xl font-black text-gray-800">{flaggedCount}</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search IP address..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                        />
                    </div>
                    <button 
                        onClick={fetchStats}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-all shadow-sm"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh List
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">IP Address</th>
                                <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Order Count</th>
                                <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Risk Level</th>
                                <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-500 font-medium">Crunching IP data...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            
                            {!loading && filteredStats.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-500 font-medium">No IP records found.</td>
                                </tr>
                            )}

                            {!loading && filteredStats.map((stat) => (
                                <tr key={stat.ip} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
                                            {stat.ip}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="font-black text-gray-800">{stat.orderCount}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {stat.orderCount >= 10 ? (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1 w-fit animate-pulse">
                                                <AlertTriangle size={12} /> Critical Flag
                                            </span>
                                        ) : stat.orderCount >= 5 ? (
                                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1 w-fit">
                                                <AlertTriangle size={12} /> Red Flag
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-tighter rounded-full w-fit">
                                                Low Risk
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {stat.isBlocked ? (
                                            <span className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider">
                                                <ShieldAlert size={14} /> Blocked
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-wider">
                                                <ShieldCheck size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            disabled={isProcessing === stat.ip}
                                            onClick={() => toggleBlock(stat.ip, stat.isBlocked)}
                                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                                stat.isBlocked 
                                                ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200" 
                                                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                            } disabled:opacity-50`}
                                        >
                                            {isProcessing === stat.ip ? "Wait..." : (stat.isBlocked ? "Unblock IP" : "Block IP")}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center text-amber-600">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800 text-sm">Security Tip</h4>
                    <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">
                        If an IP address has more than 5 orders but you haven't delivered them yet, it is highly recommended to call the customer and verify their details before processing. If an IP reaches 10+ orders within a short time, it's likely a bot attack or a spammer.
                    </p>
                </div>
            </div>
        </div>
    );
}
