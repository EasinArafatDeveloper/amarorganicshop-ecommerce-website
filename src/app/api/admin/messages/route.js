import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectMongo();
        
        // Fetch all messages, sorted by newest first
        const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json(messages, { status: 200 });

    } catch (error) {
        console.error('Error fetching admin messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
