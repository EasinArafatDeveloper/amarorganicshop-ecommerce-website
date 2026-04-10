import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(req) {
    try {
        await connectMongo();
        const data = await req.json();

        // Generate a human-readable order ID
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString() + '-' + Date.now().toString().slice(-4);

        const newOrder = new Order({
            orderId,
            customerName: data.name,
            mobile: data.mobile,
            address: data.address,
            deliveryZone: data.deliveryZone,
            note: data.note,
            items: data.items,
            subTotal: data.subTotal,
            deliveryCost: data.deliveryCost,
            finalTotal: data.finalTotal,
            status: 'Pending'
        });

        await newOrder.save();

        return NextResponse.json({ success: true, orderId: orderId, order: newOrder }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to process order', details: error.message }, { status: 500 });
    }
}
