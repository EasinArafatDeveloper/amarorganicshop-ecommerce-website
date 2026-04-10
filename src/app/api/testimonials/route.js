import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
    try {
        await connectMongo();
        const reviews = await Testimonial.find().sort({ createdAt: -1 });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();
        const data = await req.json();
        const newReview = await Testimonial.create(data);
        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}
