import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectMongo();
        
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Find the precise order format matching standard DB records
        // We lean() for reading speed and omit highly sensitive info (optional)
        const order = await Order.findOne({ orderId }).lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found matching that ID.' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                finalTotal: order.finalTotal,
                customerName: order.customerName,
                items: order.items,
            }
        });

    } catch (error) {
        console.error('Error fetching tracking info:', error);
        return NextResponse.json({ error: 'Failed to process tracking request', details: error.message }, { status: 500 });
    }
}
