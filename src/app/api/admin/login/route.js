import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await connectToDatabase();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ message: "Username and password required" }, { status: 400 });
        }

        const adminUser = await Admin.findOne({ username });
        if (!adminUser) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await adminUser.comparePassword(password);
        if (!isValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create JWT Token
        const token = await encrypt({ id: adminUser._id.toString(), role: 'admin' });
        
        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json(
            { message: "Login successful!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
