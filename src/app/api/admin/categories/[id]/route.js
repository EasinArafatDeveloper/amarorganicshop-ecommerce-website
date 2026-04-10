import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function DELETE(req, { params }) {
    try {
        await connectMongo();
        const { id } = await params;
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectMongo();
        const { id } = await params;
        const data = await req.json();
        const updated = await Category.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
