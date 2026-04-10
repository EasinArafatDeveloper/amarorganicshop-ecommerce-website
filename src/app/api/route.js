import connectToDatabase from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ 
            message: "Database connected successfully! You are ready to go.", 
            status: "success" 
        });
    } catch (error) {
        return NextResponse.json({ 
            message: "Database connection failed!", 
            error: error.message 
        }, { status: 500 });
    }
}
