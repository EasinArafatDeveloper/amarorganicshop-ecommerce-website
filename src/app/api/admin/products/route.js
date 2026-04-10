import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(req) {
    try {
        await connectMongo();
        const data = await req.json();

        // Generate Integer ID for UI backwards compatibility
        const id = Date.now();
        
        let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

        const productCode = 'AOS-' + Math.floor(100000 + Math.random() * 900000).toString();

        const newProduct = new Product({
            id,
            slug,
            productCode,
            ...data
        });

        await newProduct.save();

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
    }
}
