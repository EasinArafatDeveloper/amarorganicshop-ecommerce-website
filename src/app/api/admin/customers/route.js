import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const adminSession = cookies().get('admin_session');
        if (!adminSession || adminSession.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongo();

        // MongoDB Aggregation Pipeline
        // Groups all orders by mobile number
        const customers = await Order.aggregate([
            {
                $sort: { createdAt: -1 } // Sort so latest order data is extracted
            },
            {
                $group: {
                    _id: "$mobile",
                    customerName: { $first: "$customerName" }, // Use the most recent name
                    address: { $first: "$address" },           // Use the most recent address
                    latestOrder: { $first: "$createdAt" },     // Most recent order date
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
                $sort: { totalSpent: -1 } // Sort by highest spending customer first
            }
        ]);

        return NextResponse.json(customers, { status: 200 });
    } catch (error) {
        console.error("Customers Aggregation Error:", error);
        return NextResponse.json({ error: 'Failed to fetch customers data' }, { status: 500 });
    }
}
