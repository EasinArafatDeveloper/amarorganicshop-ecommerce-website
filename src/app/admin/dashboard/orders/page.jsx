"use client";
import React, { useState, useEffect } from 'react';
import { Truck, Edit, Trash2, CheckCircle2, ChevronDown, Phone, MapPin, Eye, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
        const result = await Swal.fire({
            title: 'Delete Order?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;
        
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.orderId !== orderId));
                toast.success('Order deleted successfully.');
                if (expandedOrder === orderId) setExpandedOrder(null);
            } else {
                toast.error('Failed to delete order.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong.');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Order marked as ${newStatus}`);
            } else {
                toast.error('Failed to update status.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Order Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Review checkout sessions, update statuses, and fulfill shipments.</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-gray-700">Live Sync Active</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#04211c] text-white">
                            <tr>
                                <th className="py-4 px-6 text-sm font-semibold text-left">Order ID</th>
                                <th className="py-4 px-6 text-sm font-semibold text-left">Customer</th>
                                <th className="py-4 px-6 text-sm font-semibold text-left">Date</th>
                                <th className="py-4 px-6 text-sm font-semibold text-left">Total Amount</th>
                                <th className="py-4 px-6 text-sm font-semibold text-left">Status</th>
                                <th className="py-4 px-6 text-sm font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">Fetching orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">No orders found. Wait for a customer to checkout.</td>
                                </tr>
                            ) : orders.map(order => (
                                <React.Fragment key={order._id}>
                                    <tr className={`border-b transition-colors group ${expandedOrder === order.orderId ? 'bg-green-50/50 border-green-100' : 'border-gray-50 hover:bg-gray-50'}`}>
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-sm font-bold text-[#f39200]">{order.orderId}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-gray-800">{order.customerName}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {order.mobile}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-green-600 font-black">৳{order.finalTotal}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button 
                                                onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)} 
                                                className="inline-block p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
                                            >
                                                {expandedOrder === order.orderId ? <ChevronDown className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(order.orderId)} 
                                                className="inline-block p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {expandedOrder === order.orderId && (
                                        <tr>
                                            <td colSpan="6" className="bg-white border-b-2 border-gray-200 p-0">
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-[inset_0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                                                    
                                                    {/* Shipping details */}
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                                            <MapPin size={16} className="text-[#f39200]" />
                                                            Shipping Information
                                                        </h4>
                                                        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 border border-gray-100">
                                                            <p><span className="font-semibold text-gray-500">Name:</span> {order.customerName}</p>
                                                            <p><span className="font-semibold text-gray-500">Phone:</span> {order.mobile}</p>
                                                            <p><span className="font-semibold text-gray-500">Zone:</span> <span className="capitalize">{order.deliveryZone.replace('_', ' ')}</span></p>
                                                            <p><span className="font-semibold text-gray-500">Address:</span> {order.address}</p>
                                                            {order.note && (
                                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                                    <span className="font-semibold text-gray-500">Customer Note:</span> 
                                                                    <p className="text-gray-700 mt-1 italic">"{order.note}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Cart details */}
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                                            <Package size={16} className="text-[#f39200]" />
                                                            Order Items
                                                        </h4>
                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <div className="space-y-3 mb-4">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                                        <div className="flex gap-3 items-center">
                                                                            {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded shrink-0 object-contain bg-white border border-gray-200 p-0.5" />}
                                                                            <div>
                                                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                                                <div className="text-xs text-gray-500">{item.quantity} x ৳{item.price}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="font-black text-gray-700">
                                                                            ৳{item.quantity * item.price}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="border-t border-gray-200 pt-3 text-sm space-y-1">
                                                                <div className="flex justify-between text-gray-500">
                                                                    <span>Subtotal</span>
                                                                    <span>৳{order.subTotal}</span>
                                                                </div>
                                                                <div className="flex justify-between text-gray-500">
                                                                    <span>Delivery</span>
                                                                    <span>৳{order.deliveryCost}</span>
                                                                </div>
                                                                <div className="flex justify-between font-black text-gray-800 pt-1 text-base">
                                                                    <span>Total Paid (COD)</span>
                                                                    <span className="text-green-600">৳{order.finalTotal}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
