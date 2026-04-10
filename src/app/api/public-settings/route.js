import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        await connectMongo();
        let settings = await StoreSettings.findOne({ singletonId: 'global' }).lean();
        
        return NextResponse.json({
            topAnnouncementText: settings?.topAnnouncementText || '',
            topAnnouncementIsActive: settings?.topAnnouncementIsActive ?? false,
            promoPopupImage: settings?.promoPopupImage || '',
            promoPopupLink: settings?.promoPopupLink || '',
            promoPopupIsActive: settings?.promoPopupIsActive ?? false,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Failed to fetch public settings' }, { status: 500 });
    }
}
