import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { decrypt, encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectMongo();
        
        const cookieStore = await cookies();
        const sessionStore = cookieStore.get('admin_session');
        
        if (!sessionStore) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await decrypt(sessionStore.value);
        if (!payload || !payload.id || typeof payload.id !== 'string') {
            // Delete cookie since it's corrupt/legacy
            cookieStore.delete('admin_session');
            return NextResponse.json({ error: 'Session expired or invalid format, please login again' }, { status: 401 });
        }

        const adminUser = await Admin.findById(payload.id).select('-password');
        if (!adminUser) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json(adminUser, { status: 200 });

    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongo();
        
        const cookieStore = await cookies();
        const sessionStore = cookieStore.get('admin_session');
        
        if (!sessionStore) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await decrypt(sessionStore.value);
        if (!payload || !payload.id || typeof payload.id !== 'string') {
            cookieStore.delete('admin_session');
            return NextResponse.json({ error: 'Session expired or invalid format, please login again' }, { status: 401 });
        }

        const adminUser = await Admin.findById(payload.id);
        if (!adminUser) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        const body = await req.json();
        const { username, currentPassword, newPassword } = body;

        // If trying to change password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
            }
            const isValid = await adminUser.comparePassword(currentPassword);
            if (!isValid) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
            }
            adminUser.password = newPassword;
        }

        // Update username if provided and different
        if (username && username !== adminUser.username) {
            const existingUser = await Admin.findOne({ username });
            if (existingUser && existingUser._id.toString() !== adminUser._id.toString()) {
                return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
            }
            adminUser.username = username;
        }

        await adminUser.save();

        return NextResponse.json({ success: true, message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating admin profile:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
