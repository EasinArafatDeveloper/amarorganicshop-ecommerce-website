import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import CustomersClient from './CustomersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomersPage() {
    await connectMongo();

    // MongoDB Aggregation Pipeline - Executed directly on the server
    const customers = await Order.aggregate([
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: "$mobile",
                customerName: { $first: "$customerName" },
                address: { $first: "$address" },
                latestOrder: { $first: "$createdAt" },
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: "$finalTotal" },
                allOrders: { $push: "$orderId" }
            }
        },
        {
            $project: {
                mobile: "$_id",
                customerName: 1,
                address: 1,
                latestOrder: 1,
                totalOrders: 1,
                totalSpent: 1,
                allOrders: 1,
                _id: 0
            }
        },
        {
            $sort: { totalSpent: -1 }
        }
    ]);

    // Pass the perfectly queried data locally to the client component
    return <CustomersClient initialCustomers={customers || []} />;
}
