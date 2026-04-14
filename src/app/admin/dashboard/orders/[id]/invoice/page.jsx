"use client";
import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, MapPin, Phone, Mail } from 'lucide-react';

export default function OrderInvoicePage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    
    const [order, setOrder] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/orders').then(res => res.json()),
            fetch('/api/admin/settings').then(res => res.json())
        ]).then(([ordersData, settingsData]) => {
            const foundOrder = ordersData.find(o => o.orderId === orderId);
            setOrder(foundOrder);
            setSettings(settingsData);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load invoice dependencies", err);
            setLoading(false);
        });
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Invoice...</div>;
    if (!order) return <div className="p-10 text-center text-red-500">Invoice not found!</div>;

    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <button onClick={() => router.push('/admin/dashboard/orders')} className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors bg-white font-medium text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </button>
                <div className="flex items-center gap-3">
                    <button onClick={handlePrint} className="bg-[#1a2b3c] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 0; size: A4 portrait; }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    .a4-container {
                        width: 210mm;
                        min-height: 296mm;
                        padding: 15mm;
                        box-sizing: border-box;
                        margin: 0 auto;
                        box-shadow: none;
                        border: none;
                    }
                    .print\\:hidden { display: none !important; }
                }
            `}} />

            {/* A4 Sized Invoice Container */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-12 print:shadow-none print:border-none print:p-0 w-full a4-container">
                
                {/* Invoice Header */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-primary tracking-tight leading-none mb-1 uppercase">
                            {settings?.invoiceCompanyName || 'AMAR ORGANIC'}
                        </h1>
                        <p className="text-gray-500 font-medium tracking-widest text-sm uppercase">
                            {settings?.invoiceSubtitle || 'Pure Nature & Quality'}
                        </p>
                        
                        <div className="mt-6 space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {settings?.footerAddress || 'Dhaka, Bangladesh'}</p>
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {settings?.contactPhone || '+8801331005210'}</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 md:mt-0 text-left md:text-right">
                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-widest opacity-20">INVOICE</h2>
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 inline-block text-left">
                            <p className="text-sm font-bold text-gray-500 mb-1">Order Number:</p>
                            <p className="text-lg font-black text-gray-800 leading-none">{order.orderId}</p>
                            
                            <p className="text-sm font-bold text-gray-500 mb-1 mt-3">Order Date:</p>
                            <p className="text-sm font-bold text-gray-800 leading-none">{invoiceDate}</p>
                        </div>
                    </div>
                </div>

                {/* Billing Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
                        <p className="font-black text-lg text-gray-800">{order.customerName}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.mobile}</p>
                    </div>
                    <div className="md:text-right">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h3>
                        <p className="text-sm font-medium text-gray-800 capitalize mb-1">{order.deliveryZone.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600 max-w-[250px] ml-auto">{order.address}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-800">
                                <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider">Item Description</th>
                                <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-center">Qty</th>
                                <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-right">Price</th>
                                <th className="py-3 px-2 text-sm font-bold text-gray-800 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4 px-2">
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                    </td>
                                    <td className="py-4 px-2 text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-4 px-2 text-right text-gray-600">৳{item.price}</td>
                                    <td className="py-4 px-2 text-right font-bold text-gray-800">৳{(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end">
                    <div className="w-full max-w-sm rounded-xl bg-gray-50 p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-3 text-sm">
                            <span className="font-bold text-gray-500">Subtotal</span>
                            <span className="font-bold text-gray-800">৳{order.subTotal}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="font-bold text-gray-500">Delivery Charge</span>
                            <span className="font-bold text-gray-800">৳{order.deliveryCost}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-gray-800">Total</span>
                                <span className="text-2xl font-black text-primary">৳{order.finalTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8 text-sm">
                    <div>
                        <p className="font-bold text-gray-800 mb-1">Customer Note:</p>
                        <p className="text-gray-500 italic">{order.note || 'No special instructions provided.'}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-800 mb-1">Payment Method</p>
                        <p className="text-gray-500">Cash on Delivery (COD)</p>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 text-xs tracking-wider uppercase font-bold print:fixed print:bottom-8 print:left-0 print:right-0 pb-4">
                    {settings?.invoiceFooterText || 'Thank you for shopping with Amar Organic!'}
                </div>
            </div>
        </div>
    );
}
