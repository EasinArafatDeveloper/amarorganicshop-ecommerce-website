"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ChevronRight, MapPin, PhoneCall, TrendingUp } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/api/admin/customers');
                if (res.ok) {
                    const data = await res.json();
                    setCustomers(data);
                }
            } catch (err) {
                console.error("Failed to fetch customers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c => 
        c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Client Database</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Manage and view all {customers.length} unique customers</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Address</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Spent</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                                        <td className="p-4"><div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-green-400 flex flex-col items-center justify-center text-white font-bold shadow-sm shrink-0">
                                                    {customer.customerName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{customer.customerName}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">Last Ordered: {new Date(customer.latestOrder).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                                    <PhoneCall size={14} className="text-secondary" />
                                                    {customer.mobile}
                                                </div>
                                                <div className="flex items-start gap-1.5 text-xs text-gray-500 max-w-[250px] truncate">
                                                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                                    <span className="truncate">{customer.address}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center justify-center bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs min-w-[32px]">
                                                {customer.totalOrders}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-black text-gray-900 flex items-center justify-end gap-1">
                                                <TrendingUp size={14} className="text-green-500" />
                                                ৳{customer.totalSpent.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link 
                                                href={`/admin/dashboard/customers/${customer.mobile}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm group-hover:shadow"
                                            >
                                                View Profile
                                                <ChevronRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
