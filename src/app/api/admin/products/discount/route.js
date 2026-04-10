import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { cookies } from 'next/headers';

export async function PATCH(request) {
    try {
        const adminSession = cookies().get('admin_session');
        if (!adminSession || adminSession.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { _id, price, originalPrice } = body;

        if (!_id || price === undefined) {
            return NextResponse.json({ error: 'Missing Required Fields (_id, price)' }, { status: 400 });
        }

        await connectMongo();

        // Update the product cleanly
        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { 
                price: Number(price), 
                originalPrice: originalPrice ? Number(originalPrice) : null 
            },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

    } catch (error) {
        console.error("Discount API Error:", error);
        return NextResponse.json({ error: 'Failed to apply discount' }, { status: 500 });
    }
}
