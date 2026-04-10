import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectToDatabase();
        
        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin account already exists!" }, 
                { status: 400 }
            );
        }

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password required" }, 
                { status: 400 }
            );
        }

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        return NextResponse.json(
            { message: "Admin Setup Successful! You can login now." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error setting up admin", error: error.message },
            { status: 500 }
        );
    }
}
