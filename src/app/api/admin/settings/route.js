import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectMongo from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export async function GET() {
    try {
        await connectMongo();
        
        let settings = await StoreSettings.findOne({ singletonId: 'global' });
        
        if (!settings) {
            settings = await StoreSettings.create({ singletonId: 'global' });
        }

        return NextResponse.json(settings, { status: 200 });

    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongo();
        const data = await req.json();

        // Ensure we are using the latest schema even if Mongoose cached a version
        // We use $set to only update provided fields
        const updated = await StoreSettings.findOneAndUpdate(
            { singletonId: 'global' },
            { 
                $set: {
                    ...data,
                    // Explicitly ensuring heroBanners is included in case of schema caching
                    heroBanners: data.heroBanners || []
                } 
            },
            { new: true, upsert: true }
        );

        // Revalidate multiple paths to ensure the UI updates
        revalidatePath('/', 'layout');
        revalidatePath('/(store)/Home', 'page');

        return NextResponse.json({ success: true, settings: updated }, { status: 200 });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
