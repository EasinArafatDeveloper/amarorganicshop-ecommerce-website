import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// UPDATE Product
export async function PUT(req, { params }) {
    try {
        await connectMongo();
        const data = await req.json();
        
        // Next.js 15+ requires params to be awaited
        const resolvedParams = await params;
        const idParam = resolvedParams.id; // This is the numerical ID we used earlier or the slug. In our admin table we are using product.id

        // Because our models use "id" as number instead of _id natively for frontend compat:
        const updatedProduct = await Product.findOneAndUpdate(
            { id: Number(idParam) },
            { $set: data },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
    }
}

// DELETE Product
export async function DELETE(req, { params }) {
    try {
        await connectMongo();
        
        // Next.js 15+ requires params to be awaited
        const resolvedParams = await params;
        const idParam = resolvedParams.id;

        const deletedProduct = await Product.findOneAndDelete({ id: Number(idParam) });

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
    }
}
