import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
    try {
        await connectMongo();
        const { id } = params;

        const updatedMsg = await ContactMessage.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!updatedMsg) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: updatedMsg }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectMongo();
        const { id } = params;

        const deletedMsg = await ContactMessage.findByIdAndDelete(id);

        if (!deletedMsg) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
