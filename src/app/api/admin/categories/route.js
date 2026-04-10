import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function POST(req) {
    try {
        await connectMongo();
        const data = await req.json();
        
        const newCategory = await Category.create(data);
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Creation failed' }, { status: 500 });
    }
}
