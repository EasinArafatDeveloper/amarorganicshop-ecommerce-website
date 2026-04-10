import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// UPDATE Order Status
export async function PUT(req, { params }) {
    try {
        await connectMongo();
        const data = await req.json();
        
        // Next.js 15+ params requirement
        const resolvedParams = await params;
        const idParam = resolvedParams.id; // orderId logic e.g., 'ORD-1234-5678'
        
        // We use orderId as the query match
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: idParam },
            { $set: data },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
    }
}

// DELETE Order
export async function DELETE(req, { params }) {
    try {
        await connectMongo();
        
        const resolvedParams = await params;
        const idParam = resolvedParams.id;

        const deletedOrder = await Order.findOneAndDelete({ orderId: idParam });

        if (!deletedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Order deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Failed to delete order', details: error.message }, { status: 500 });
    }
}
