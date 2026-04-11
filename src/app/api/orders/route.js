import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import StoreSettings from '@/lib/models/StoreSettings';

export async function POST(req) {
    try {
        await connectMongo();
        const data = await req.json();

        // Generate a human-readable order ID
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString() + '-' + Date.now().toString().slice(-4);

        // Fetch delivery settings for backend verification
        const settings = await StoreSettings.findOne({ singletonId: 'global' }).lean();
        
        // Find the matching delivery zone cost
        let serverDeliveryCost = 0;
        if (settings?.deliveryZones) {
            const zone = settings.deliveryZones.find(z => z.id === data.deliveryZone);
            if (zone) serverDeliveryCost = zone.cost;
        }

        // Apply free delivery threshold if active
        if (settings?.isFreeDeliveryActive && data.subTotal >= settings.freeDeliveryAbove) {
            serverDeliveryCost = 0;
        }

        const calculatedFinalTotal = data.subTotal + serverDeliveryCost;

        const newOrder = new Order({
            orderId,
            customerName: data.name,
            mobile: data.mobile,
            address: data.address,
            deliveryZone: data.deliveryZone,
            note: data.note,
            items: data.items,
            subTotal: data.subTotal,
            deliveryCost: serverDeliveryCost,
            finalTotal: calculatedFinalTotal,
            status: 'Pending'
        });

        await newOrder.save();

        return NextResponse.json({ success: true, orderId: orderId, order: newOrder }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to process order', details: error.message }, { status: 500 });
    }
}
