import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET() {
    try {
        await connectMongo();
        
        // Fetch all orders sorted by newest first
        const orders = await Order.find({}).sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
