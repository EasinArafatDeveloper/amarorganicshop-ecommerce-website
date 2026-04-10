import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export const revalidate = 0;

export async function GET() {
    try {
        await connectMongo();
        
        // Fetch up to 10 Pending orders sorted by newest first
        const pendingOrders = await Order.find({ status: 'Pending' })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('orderId customerName createdAt finalTotal')
            .lean();

        return NextResponse.json(pendingOrders, { status: 200 });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
