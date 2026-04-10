import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { notFound } from 'next/navigation';
import { ChevronLeft, User, PhoneCall, MapPin, Calendar, ShoppingBag, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CustomerProfilePage({ params }) {
    const { phone } = params;
    const decodedPhone = decodeURIComponent(phone);

    await connectMongo();

    // Fetch all orders for this mobile number, sorted newest first
    const orders = await Order.find({ mobile: decodedPhone }).sort({ createdAt: -1 }).lean();

    if (!orders || orders.length === 0) {
        notFound();
    }

    // Extract latest customer info from the most recent order
    const latestOrder = orders[0];
    const customerName = latestOrder.customerName;
    const currentAddress = latestOrder.address;

    // Aggregate stats
    const totalSpent = orders.reduce((acc, order) => acc + (order.finalTotal || 0), 0);
    const totalOrders = orders.length;
    const successfulOrders = orders.filter(o => o.status === 'Delivered').length;

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'Delivered':
                return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100"><CheckCircle2 size={12} /> Delivered</span>;
            case 'Cancelled':
                return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100"><XCircle size={12} /> Cancelled</span>;
            case 'Processing':
                return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100"><Package size={12} /> Processing</span>;
            default:
                return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md text-xs font-bold border border-orange-100"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header & Back Action */}
            <div className="flex items-center gap-3">
                <Link href="/admin/dashboard/customers" className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors bg-white">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Customer Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                        {/* decorative background header */}
                        <div className="h-24 bg-gradient-to-tr from-primary/10 to-green-500/20 absolute top-0 w-full z-0"></div>
                        
                        <div className="px-6 py-8 relative z-10 flex flex-col items-center mt-6">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center relative bg-gradient-to-t from-gray-100 to-white overflow-hidden mb-4">
                                <span className="text-4xl font-black text-primary drop-shadow-sm uppercase">
                                    {customerName.charAt(0)}
                                </span>
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900 text-center">{customerName}</h2>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">VIP Customer</span>

                            <div className="w-full mt-8 space-y-4">
                                <div className="flex items-start gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                    <PhoneCall className="text-secondary w-5 h-5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone Number</p>
                                        <p className="font-bold text-gray-800">{decodedPhone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                    <MapPin className="text-secondary w-5 h-5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Current Address</p>
                                        <p className="font-semibold text-gray-800 text-sm leading-snug">{currentAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-black text-gray-800 mb-6 text-sm uppercase tracking-wider">Lifetime Stats</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-gray-500 text-sm font-medium">Total Spent</span>
                                <span className="font-black text-xl text-primary">৳{totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-gray-500 text-sm font-medium">Total Orders</span>
                                <span className="font-bold text-gray-800 text-lg">{totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm font-medium">Delivered Jobs</span>
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-sm">{successfulOrders}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                    <ShoppingBag className="text-primary w-5 h-5" />
                                    Order History
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">Detailed breakdown of all purchases</p>
                            </div>
                            <span className="bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-100">
                                {totalOrders} Records found
                            </span>
                        </div>

                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <div key={order._id} className="relative pl-6 pb-6 border-l-2 border-gray-100 last:border-transparent last:pb-0">
                                    <div className="absolute w-4 h-4 bg-primary text-white rounded-full -left-[9px] top-1 ring-4 ring-white shadow-sm flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                    
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-colors">
                                        {/* Order Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200/60">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black tracking-tight text-gray-900 border-b-2 border-primary/20 leading-none">#{order.orderId}</span>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 font-medium mt-1.5">
                                                    <Calendar size={12} />
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Order Value</p>
                                                <p className="text-lg font-black text-gray-900">৳{order.finalTotal.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-gray-100/50 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded shrink-0 bg-gray-50 border border-gray-100 p-0.5">
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.name} 
                                                                className="w-full h-full object-contain" 
                                                                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800 leading-tight">{item.name}</p>
                                                            <p className="text-xs text-gray-400 font-medium">{item.quantity} {item.quantity > 1 ? 'items' : 'item'} x ৳{item.price}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        ৳{(item.price * item.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="flex items-center justify-end gap-6 pt-3 text-xs">
                                                <span className="text-gray-500 whitespace-nowrap">Subtotal: <b>৳{order.subTotal}</b></span>
                                                <span className="text-gray-500 whitespace-nowrap">Delivery: <b className="text-[#1a2b3c]">৳{order.deliveryCost}</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
