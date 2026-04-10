import { Users, ShoppingCart, PackageOpen, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import DashboardChart from './DashboardChart';
import Link from 'next/link';

// Helper to format dates to simple strings (e.g., "12 Apr")
const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const revalidate = 0; // Dynamic route

export default async function DashboardOverview() {
  await connectMongo();

  // 1. Fetch Basic Counts
  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();
  
  // 2. Fetch Unique Customers (distinct phone numbers)
  const uniqueCustomers = (await Order.distinct('mobile')).length;

  // 3. Aggregate Total Revenue (excluding pending/cancelled if appropriate, but let's just exclude Cancelled for total GMV)
  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$finalTotal' } } }
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // 4. Generate Last 7 Days Revenue Data for Chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0,0,0,0);

  const dailyRevenue = await Order.aggregate([
    { 
       $match: { 
         createdAt: { $gte: sevenDaysAgo },
         status: { $ne: 'Cancelled' }
       } 
    },
    {
       $group: {
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
         revenue: { $sum: '$finalTotal' }
       }
    },
    { $sort: { _id: 1 } }
  ]);

  // Construct continuous 7 day array to fill missing days with 0
  const chartData = [];
  for (let i = 0; i < 7; i++) {
     const d = new Date(sevenDaysAgo);
     d.setDate(d.getDate() + i);
     const dateStr = d.toISOString().split('T')[0];
     
     const found = dailyRevenue.find(r => r._id === dateStr);
     chartData.push({
         date: formatDate(d),
         revenue: found ? found.revenue : 0
     });
  }

  // 5. Fetch Recent 5 Orders
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

  const stats = [
    { name: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Orders', value: orderCount.toLocaleString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Products', value: productCount.toLocaleString(), icon: PackageOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Customers', value: uniqueCustomers.toLocaleString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'text-yellow-600 bg-yellow-100';
        case 'Processing': return 'text-blue-600 bg-blue-100';
        case 'Delivered': return 'text-green-600 bg-green-100';
        case 'Cancelled': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time metrics and analytics for Amar Organic Shop.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-black text-gray-800 truncate">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <TrendingUp className="text-green-500 w-5 h-5" /> 
                 Revenue Trend (Last 7 Days)
               </h2>
           </div>
           
           <div className="flex-1 w-full min-h-[350px]">
              <DashboardChart data={chartData} />
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <CheckCircle className="text-blue-500 w-5 h-5" />
             Quick Actions
           </h2>
           <div className="space-y-4 flex-1">
             <Link href="/admin/dashboard/products/add" className="w-full bg-green-50 text-green-700 border border-green-200 py-4 rounded-xl hover:bg-green-100 transition-colors font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm">
                + Add New Product
             </Link>
             <Link href="/admin/dashboard/orders" className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-4 rounded-xl hover:bg-blue-100 transition-colors font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm">
                📦 Manage Latest Orders
             </Link>
             <Link href="/admin/dashboard/ui-settings" className="w-full bg-purple-50 text-purple-700 border border-purple-200 py-4 rounded-xl hover:bg-purple-100 transition-colors font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm">
                🎨 Customize Homepage UI
             </Link>
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System Status</p>
             <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                All Systems Operational
             </div>
           </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="text-amber-500 w-5 h-5" />
                Recent Orders
            </h2>
            <Link href="/admin/dashboard/orders" className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                View All →
            </Link>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {recentOrders.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">No recent orders found.</td>
                        </tr>
                    ) : recentOrders.map(order => (
                        <tr key={order._id?.toString()} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 font-mono text-sm font-bold text-gray-600">{order.orderId}</td>
                            <td className="py-4 px-6 font-medium text-gray-800">{order.customerName}</td>
                            <td className="py-4 px-6 font-black text-green-600">৳{order.finalTotal}</td>
                            <td className="py-4 px-6">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
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
