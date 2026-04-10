import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function DELETE(req, { params }) {
    try {
        await connectMongo();
        const { id } = await params;
        await Testimonial.findByIdAndDelete(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectMongo();
        const { id } = await params;
        const data = await req.json();
        const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
