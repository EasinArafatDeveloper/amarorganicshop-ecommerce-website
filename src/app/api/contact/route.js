import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import ContactMessage from '@/lib/models/ContactMessage';

export async function POST(req) {
    try {
        await connectMongo();
        
        const data = await req.json();
        const { name, contactInfo, subject, message } = data;

        if (!name || !contactInfo || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const newMessage = new ContactMessage({
            name,
            contactInfo,
            subject,
            message
        });

        await newMessage.save();

        return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 201 });

    } catch (error) {
        console.error('Contact Submission Error:', error);
        return NextResponse.json({ error: 'Failed to submit message', details: error.message }, { status: 500 });
    }
}
