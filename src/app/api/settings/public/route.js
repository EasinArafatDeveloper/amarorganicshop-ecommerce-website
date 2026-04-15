import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export async function GET() {
    try {
        await connectMongo();
        
        let settings = await StoreSettings.findOne({ singletonId: 'global' }).select('logoUrl contactPhone contactEmail contactAddress contactPhoneHours facebookUrl instagramUrl linkedinUrl sectionTitles footerDescription footerAddress footerCopyright -_id').lean();
        
        if (!settings) {
            settings = { logoUrl: '' };
        }

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
