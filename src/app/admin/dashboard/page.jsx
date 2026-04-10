import { Users, ShoppingCart, PackageOpen, DollarSign } from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    { name: 'Total Revenue', value: '৳ 0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Orders', value: '0', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Products', value: '0', icon: PackageOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Customers', value: '0', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
           <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
             <p>No new orders right now.</p>
           </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
           <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
           <div className="space-y-3">
             <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-sm text-left px-4">
                + Add New Product
             </button>
             <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-sm text-left px-4">
                View All Orders
             </button>
             <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-sm text-left px-4">
                Customize Homepage
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
